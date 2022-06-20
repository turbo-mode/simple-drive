import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadFile } from "hooks/api/files";

const chunkSize = 1024 * 10; //its 10KB, increase the number measure in KB

const Upload: NextPage = () => {
  const controller = useRef<AbortController | null>(null);
  const { mutate: uploadFileChunk } = useUploadFile();
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone();
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  // state to tell which file is uploading
  const [currentFileIdx, setCurrentFileIdx] = useState<number | null>(null);
  // state to tell the last index of files that already uploaded to the server
  const [lastUploadedFileIdx, setLastUploadedFileIdx] = useState<number | null>(
    null
  );
  // state to tell what index from chunks is uploading to the server
  // since we send the data as octet-stream, the data will be sliced
  // as bytes[]
  const [currentChunkIdx, setCurrentChunkIdx] = useState<number | null>(null);

  // start uploading after clicking the upload button
  const beginToUpload = useCallback(() => {
    if (acceptedFiles.length <= 0 || currentFileIdx !== null) return;

    setCurrentFileIdx(
      lastUploadedFileIdx === null ? 0 : lastUploadedFileIdx + 1
    );
  }, [acceptedFiles, currentFileIdx, lastUploadedFileIdx]);

  // read and upload file logic function
  const readAndUploadCurrentChunk = useCallback(() => {
    if (
      acceptedFiles.length <= 0 ||
      currentFileIdx === null ||
      currentChunkIdx === null
    )
      return;

    const reader = new FileReader();
    const file = acceptedFiles[currentFileIdx];
    // where the beginning of the chunk
    const from = currentChunkIdx * chunkSize;
    // the end part of the chunk
    const to = from + chunkSize;
    // convert the file as binary
    const blob = file.slice(from, to);
    // upload current chunk
    reader.onload = (e) => {
      const data = e.target?.result;

      if (data === null || data === undefined) return;

      controller.current = new AbortController();

      uploadFileChunk(
        {
          data,
          config: {
            headers: {
              "Content-Type": "application/octet-stream",
            },
            params: {
              name: file.name,
              totalChunks: Math.ceil(file.size / chunkSize),
              currentChunkIdx,
            },
            signal: controller.current.signal,
          },
        },
        {
          onSuccess(res) {
            console.log(res);
          },
        }
      );
    };
    // read as data url
    reader.readAsDataURL(blob);
  }, [acceptedFiles, currentFileIdx, currentChunkIdx, uploadFileChunk]);

  // cancel request with AbortController
  useEffect(() => {
    return () => {
      controller.current?.abort();
    };
  }, []);

  // listen the changes of file that's uploading and reset
  // the chunk index everytime current file index changed.
  // ...
  // if there's no more file to be uploaded, we set the chunk index
  // to null
  useEffect(() => {
    if (currentFileIdx === null) {
      return setCurrentChunkIdx(null);
    }

    setCurrentChunkIdx(0);
  }, [currentFileIdx]);

  // listen the changes of chunk index
  // here, we send the data to the server everytime
  // chunk index changed
  useEffect(() => {
    if (currentChunkIdx === null) return;

    readAndUploadCurrentChunk();
  }, [currentChunkIdx, readAndUploadCurrentChunk]);

  return (
    <Container maxW="container.xl" height="100vh">
      <Flex
        width="full"
        height="full"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="10"
      >
        <Flex
          {...getRootProps({
            onClick: (e) => {
              if (uploadButtonRef?.current?.contains(e.target as Node))
                e.stopPropagation();
            },
          })}
          position="relative"
          width="full"
          height="400px"
          paddingX="4"
          maxWidth="620px"
          justifyContent="center"
          alignItems="center"
          borderWidth="3px"
          borderStyle="dashed"
          borderColor={isDragActive ? "gray.400" : "gray.300"}
          borderRadius="lg"
          backgroundColor="gray.100"
          cursor="pointer"
        >
          <input {...getInputProps()} />
          {acceptedFiles.length > 0 ? (
            <>
              <Text
                position="absolute"
                bottom="1rem"
                right="1rem"
                userSelect="none"
                color="gray.400"
                fontWeight="semibold"
                fontSize={{ base: "sm", sm: "mg" }}
              >
                Transfer speed: 0 KB/s
              </Text>
              <Flex
                width="full"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap="4"
              >
                <Text
                  userSelect="none"
                  color="gray.400"
                  fontWeight="bold"
                  fontSize={{ base: "md", sm: "lg" }}
                  textAlign="center"
                >
                  Uploaded 0 from {acceptedFiles.length} files
                </Text>

                <Box
                  width="full"
                  maxWidth="240px"
                  paddingY="0.5"
                  backgroundColor="gray.300"
                  borderWidth="3px"
                  borderStyle="solid"
                  borderColor="gray.300"
                  borderRadius="lg"
                  marginBottom="2"
                />

                {acceptedFiles.length > 0 && (
                  <Button
                    ref={uploadButtonRef}
                    colorScheme="blue"
                    width="full"
                    maxWidth="240px"
                    onClick={beginToUpload}
                  >
                    Upload
                  </Button>
                )}
              </Flex>
            </>
          ) : isDragActive ? (
            <Text
              userSelect="none"
              color="gray.500"
              fontWeight="bold"
              fontSize={{ base: "md", sm: "lg" }}
              textAlign="center"
            >
              Drop the files here ...
            </Text>
          ) : (
            <Text
              userSelect="none"
              color="gray.400"
              fontWeight="bold"
              fontSize={{ base: "md", sm: "lg" }}
              textAlign="center"
            >
              Drag and drop some files here, or click to select files
            </Text>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Upload;

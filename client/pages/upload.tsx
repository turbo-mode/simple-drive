import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const Upload: NextPage = () => {
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // upload files
  }, []);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
    });
  // state to tell which file is uploading
  const [currentFileIdx, setCurrentFileIdx] = useState<number | null>(null);
  // state to tell the last index of files that already uploaded to the server
  const [lastUploadedFileIdx, setLastUploadedFileIdx] = useState<number | null>(
    null
  );
  // state to tell what index from chunks is uploading to the server
  // since we send the data as octet-stream, the data will be sliced
  // as bytes[]
  const [currentChuckIdx, setCurrentChunkIdx] = useState<number | null>(null);

  // listen the changes of accepted files
  // here, we control the changes of current file index depending on last uploaded file index
  useEffect(() => {
    // no files accepted or still uploading some file
    if (acceptedFiles.length <= 0 || currentFileIdx !== null) return;

    setCurrentFileIdx(
      lastUploadedFileIdx === null ? 0 : lastUploadedFileIdx + 1
    );
  }, [acceptedFiles, currentFileIdx, lastUploadedFileIdx]);

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
                Transfer speed: 0 Kb/s
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

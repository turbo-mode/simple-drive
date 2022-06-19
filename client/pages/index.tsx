import { Button, Container, Flex, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Container maxW="container.xl">
      <Flex
        width="full"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Heading
          as="h1"
          textAlign="center"
          size="2xl"
          lineHeight="1.1"
          letterSpacing="-.05em"
          marginBottom="30px"
          maxWidth="650px"
        >
          Simple Service to Keep Your Files Safe Easily
        </Heading>

        <Heading
          as="h3"
          textAlign="center"
          size="sm"
          fontWeight="light"
          marginBottom="40px"
          maxWidth="650px"
        >
          We provide a solution for you to store files safely. You will be given
          a key string that you can use to view and download the files you have
          saved
        </Heading>

        <Flex
          flexDirection={{ base: "column", sm: "row" }}
          gap="3"
          alignItems="center"
          justifyContent="center"
          width="full"
        >
          <Button
            colorScheme="blue"
            variant="solid"
            width={{ base: "full", sm: "auto" }}
            maxWidth="240px"
          >
            Upload Your Files
          </Button>
          <Button
            colorScheme="blue"
            variant="outline"
            width={{ base: "full", sm: "auto" }}
            maxWidth="240px"
          >
            Open Your File
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Home;

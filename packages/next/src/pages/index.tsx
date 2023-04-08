import { Inter } from "next/font/google";
import { SeoContainer } from "@/Components/SeoContainer";
import { Box, Container, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Illustration from "@/Components/Illustration";
import { ChatboxContainer } from "@/PageComponents/ChatboxContainer";

export default function Home() {
  return (
    <SeoContainer>
      <Flex
        direction="column"
        backgroundImage="/background.svg"
        minH="100vh"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <Container py={{ base: "4", lg: "5" }}>
          <Box as="nav" pb={{ base: "12", md: "24" }}>
            <Flex>
              <Illustration w={6} name="LogoIcon" />
              <Text ml={2} fontWeight="bold">
                AskSEC.ai
              </Text>
            </Flex>
            <Divider mt={4} />
          </Box>
          <Box as="section">
            <Heading
              textAlign="center"
              maxW="2xl"
              mx="auto"
              background="linear-gradient(98.7deg, #FFFFFF 41.26%, rgba(255, 255, 255, 0.3) 101.17%)"
              backgroundClip="text"
              color="transparent"
              size={{ base: "lg", sm: "2xl", md: "3xl" }}
              as="h1"
            >
              Instant Q&A from SEC filings
            </Heading>
            <Text
              maxW="xl"
              mx="auto"
              fontSize={{ base: "sm", sm: "lg", md: "xl" }}
              textAlign="center"
              mt={6}
              color="whiteAlpha.800"
            >
              Too slammed to read through 80 page SEC documents?
              <br />
              Ask a question, and we’ll read the 10-K’s for you.
            </Text>
          </Box>
          <Box as="section" mt={12} h="full">
            <ChatboxContainer />
          </Box>
        </Container>
      </Flex>
    </SeoContainer>
  );
}

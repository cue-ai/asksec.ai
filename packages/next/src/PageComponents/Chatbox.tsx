import { FC, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Spacer,
  Spinner,
  Tag,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ChatRow } from "@/PageComponents/ChatRow";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TenKSection } from "@prisma/client";
import { useSwr } from "@/Hooks/useSwr";
import { SecCompanyRes } from "@asksec-ai/shared/types/apiRes";
import { analytics } from "@/Lib/analytics";

type FormData = {
  question: string;
};

const formDataSchema = z.object({
  question: z.string(),
});

type ChatboxProps = {
  ticker: string;
};

type Action = {
  question: string;
  answer: string;
  section: TenKSection;
  text: string;
};

export const Chatbox: FC<ChatboxProps> = ({ ticker }) => {
  const toast = useToast();
  const { data, isLoading } = useSwr<SecCompanyRes>(`/api/ticker/${ticker}`, {
    refreshInterval: 1000,
  });

  const isCompanyReady = data?.secCompany?.status === "Success";
  const isCompanyError = data?.secCompany?.status === "Error";

  const { register, handleSubmit, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
  });

  const [actions, setActions] = useState<Action[]>([]);
  const [mSendLoading, setMSendLoading] = useState(false);

  const onSubmit = async ({ question }: FormData) => {
    setMSendLoading(true);
    try {
      const d = await fetch(`/api/ticker/${ticker}/question`, {
        body: JSON.stringify({
          question,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const {
        answer,
        section,
        text,
      }: { answer: string; section: TenKSection; text: string } =
        (await d.json()) as any;

      analytics.track("Question Asked", {
        ticker,
        question,
        answer,
      });

      setActions((prev) => [
        ...prev,
        {
          question,
          answer,
          section,
          text,
        },
      ]);
      reset();
    } catch (err: any) {
      toast({
        title: "Error asking question",
        description: err.toString(),
        status: "error",
      });
    }
    setMSendLoading(false);
  };

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        w="full"
        p={4}
        background="blackAlpha.300"
      >
        {isCompanyReady || isLoading ? (
          <Box px={4} py={2} bg="#26273A" borderRadius="1000">
            <Text color="whiteAlpha.800" fontSize="lg" fontWeight="semibold">
              {ticker}
            </Text>
          </Box>
        ) : isCompanyError ? (
          <Tag colorScheme="red" size="lg" ml={4}>
            Error for {ticker}...
          </Tag>
        ) : (
          <Tag colorScheme="yellow" size="lg" ml={4}>
            Scraping data for {ticker}...
          </Tag>
        )}
      </Flex>
      {isCompanyReady && !isLoading ? (
        <VStack pt={2} p={4} overflowY="auto" w="full">
          <ChatRow
            message={`Ask me any question about ${ticker} 👀`}
            ticker={ticker}
          />

          {actions.map(({ question, answer, section, text }) => (
            <>
              <ChatRow message={question} isUser ticker={ticker} />
              <ChatRow
                message={answer}
                section={section}
                text={text}
                ticker={ticker}
              />
            </>
          ))}
        </VStack>
      ) : isCompanyError ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Something went wrong :(</AlertTitle>
          <AlertDescription>Ping @caelinsutch on Twitter</AlertDescription>
        </Alert>
      ) : (
        <Flex alignItems="center" justifyContent="center" mt={8}>
          <Spinner />
        </Flex>
      )}
      <Spacer />
      {actions.length === 0 && (
        <HStack
          px={4}
          pt={4}
          background="blackAlpha.300"
          spacing={2}
          w="full"
          overflowX="scroll"
        >
          <Tag
            cursor="pointer"
            onClick={() => {
              setValue("question", `What does ${ticker} do?`);
              handleSubmit(onSubmit)();
            }}
          >
            What does {ticker} do?
          </Tag>
          <Tag
            cursor="pointer"
            onClick={() => {
              setValue("question", `What are some risks for ${ticker}?`);
              handleSubmit(onSubmit)();
            }}
          >
            What are some risks for {ticker}?
          </Tag>
          <Tag
            cursor="pointer"
            onClick={() => {
              setValue(
                "question",
                `What does ${ticker} say about revenue intelligence?`
              );
              handleSubmit(onSubmit)();
            }}
          >
            What does {ticker} say about AI?
          </Tag>
        </HStack>
      )}
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        w="full"
        background="blackAlpha.300"
        p={4}
      >
        <Input
          size="lg"
          placeholder="Ask a question"
          {...register("question")}
          isDisabled={mSendLoading || !isCompanyReady}
        />
        <Button
          ml={1}
          size="lg"
          type="submit"
          isLoading={mSendLoading}
          isDisabled={!isCompanyReady}
        >
          Go
        </Button>
      </Flex>
    </>
  );
};

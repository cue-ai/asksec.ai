import { FC } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { EmptyChatbox } from "@/PageComponents/EmptyChatbox";
import { StringParam, useQueryParam } from "use-query-params";
import { Chatbox } from "@/PageComponents/Chatbox";

export const ChatboxContainer: FC = () => {
  const [ticker, setTicker] = useQueryParam("ticker", StringParam);

  const onSubmit = ({ ticker: nTicker }: any) => {
    setTicker(nTicker);
  };

  return (
    <>
      {ticker && (
        <Flex alignItems="center" justifyContent="center" mb={4}>
          <Button
            variant="link"
            textDecoration="underline"
            onClick={() => setTicker(null)}
          >
            Research a new company
          </Button>
        </Flex>
      )}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="500px"
        minH="50vh"
        maxW="2xl"
        borderRadius="lg"
        background="linear-gradient(128.24deg, rgba(25, 26, 41, 0.9) 5.39%, rgba(25, 26, 41, 0.54) 101.42%)"
        border="2px solid #1F264B"
        backdropFilter="blue(42px)"
        mx="auto"
      >
        {ticker ? (
          <Chatbox ticker={ticker} />
        ) : (
          <EmptyChatbox onSubmit={onSubmit} />
        )}
      </Flex>
    </>
  );
};

import { FC } from "react";
import { Box, Flex, HStack, SkeletonCircle, Text } from "@chakra-ui/react";

type ChatBubbleProps = {
  message: string;
  isUser?: boolean;
  isLoading?: boolean;
};

export const ChatRow: FC<ChatBubbleProps> = ({
  isUser,
  message,
  isLoading,
}) => (
  <Flex
    alignItems="center"
    w="full"
    justifyContent={isUser ? "end" : " start"}
    py={1}
  >
    <Box
      maxW="60%"
      p={3}
      borderRadius="15px"
      padding="6px 12px"
      bg={isUser ? "blue.500" : "#3B3B3D"}
      h={isLoading ? "36px" : "auto"}
    >
      {isLoading ? (
        <HStack spacing={1} alignItems="center" h="full">
          <SkeletonCircle size="3" />
          <SkeletonCircle size="3" />
          <SkeletonCircle size="3" />
        </HStack>
      ) : (
        <Text>{message}</Text>
      )}
    </Box>
  </Flex>
);

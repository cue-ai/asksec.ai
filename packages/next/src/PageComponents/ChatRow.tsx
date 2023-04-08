import { FC } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { TenKSection } from "@prisma/client";
import { sectionToEnglish } from "@asksec-ai/shared/enumToEnglish";
import { analytics } from "@/Lib/analytics";

type ChatBubbleProps = {
  message: string;
  isUser?: boolean;
  isLoading?: boolean;
  section?: TenKSection;
  text?: string;
  ticker: string;
};

export const ChatRow: FC<ChatBubbleProps> = ({
  isUser,
  message,
  isLoading,
  section,
  text,
  ticker,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen() {
      analytics.track("View Source", {
        ticker,
      });
    },
  });
  return (
    <>
      {section && text && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Direct quote from Section {sectionToEnglish[section]}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>"{text}"</ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
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
            <>
              <Text>{message}</Text>
              {section && (
                <Text
                  color="whiteAlpha.500"
                  fontSize="sm"
                  textDecoration="underline"
                  cursor="pointer"
                  onClick={onOpen}
                >
                  View Source (from Section {sectionToEnglish[section]})
                </Text>
              )}
            </>
          )}
        </Box>
      </Flex>
    </>
  );
};

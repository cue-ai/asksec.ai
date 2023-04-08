import { FC } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = {
  ticker: string;
};

const formDataSchema = z.object({
  ticker: z.string().min(1).max(5),
});

type EmptyChatboxProps = {
  onSubmit: (data: FormData) => void;
};

export const EmptyChatbox: FC<EmptyChatboxProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
  });

  return (
    <Box p={4}>
      <Text textAlign="center" fontSize="sm" color="whiteAlpha.500">
        Enter a stock ticker
      </Text>
      <Flex mt={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <Input size="lg" placeholder="AAPL" {...register("ticker")} />
        <Button ml={1} size="lg" type="submit">
          Go
        </Button>
      </Flex>
      {errors?.ticker && (
        <Text color="red.500" mt={1} textAlign="center">
          {errors.ticker.message}
        </Text>
      )}
    </Box>
  );
};

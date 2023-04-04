import { Configuration, OpenAIApi } from "openai";

const openAiKey = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: openAiKey,
});

const openAi = new OpenAIApi(configuration);

export const queryOpenAI = async (prompt: string): Promise<string> => {
  const completion = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  if (!completion.data.choices[0]?.message?.content)
    throw new Error("No completion found");

  return completion.data.choices[0]?.message?.content?.trim();
};

export const generateEmbedding = async (input: string) => {
  const res = await openAi.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  });

  return res.data.data?.[0].embedding;
};

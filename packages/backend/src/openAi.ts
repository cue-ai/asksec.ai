import { Configuration, OpenAIApi } from "openai";

const openAiKey = process.env.OPENAI_API_KEY

const configuration = new Configuration({
  apiKey: openAiKey,
});
export const openai = new OpenAIApi(configuration);

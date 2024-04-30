import { OpenAI } from "openai";

// ADD MORE MODELS IF NEEDED
export const OPENAI_MODELS = [
  "gpt-3.5-turbo-0125",
  "gpt-4-0125-preview",
  "gpt-4-turbo-preview",
  "gpt-4-vision-preview",
] as const;

export type ModelType =
  | "gpt-4-0125-preview"
  | "gpt-4-turbo-preview"
  | "gpt-4-vision-preview"
  | "gpt-3.5-turbo-0125"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-16k-0613"
  | "gpt-4"
  | "gpt-4-32k"
  | "gpt-4-0613"
  | "gpt-4-32k-0613";

export class LLMOpenAI {
  client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateEmbedding(
    input: string | string[] | number[] | number[][],
    embeddingModel?:
      | "text-embedding-3-small"
      | "text-embedding-ada-002"
      | "text-embedding-3-large"
  ): Promise<Record<string, any>> {
    const instance = this.client;

    // # call openai
    const resp = await instance.embeddings.create({
      input,
      model: embeddingModel ?? "text-embedding-3-small",
    });

    return resp;
  }

  async generate() {
    // todo
  }
}

export const llmOpenAI = new LLMOpenAI();

import {
  type TiktokenModel,
  type Tiktoken,
  encodingForModel,
  getEncoding,
} from "js-tiktoken";

import type { Message } from "ai/react";

export const numTokensFromMessages = (
  messages: object[],
  model: TiktokenModel = "gpt-3.5-turbo-0613"
): number => {
  let encoding: Tiktoken;
  let tokensPerMessage = 0;
  let tokensPerName = 0;

  try {
    encoding = encodingForModel(model);
  } catch (error) {
    console.warn("Warning: model not found. Using cl100k_base encoding.");
    encoding = getEncoding("cl100k_base");
  }

  if (
    model === "gpt-3.5-turbo-0613" ||
    model === "gpt-3.5-turbo-16k-0613" ||
    model === "gpt-4-0314" ||
    model === "gpt-4-32k-0314" ||
    model === "gpt-4-0613" ||
    model === "gpt-4-32k-0613"
  ) {
    tokensPerMessage = 3;
    tokensPerName = 1;
  } else if (model === "gpt-3.5-turbo-0301") {
    tokensPerMessage = 4;
    tokensPerName = -1;
  } else if (model.includes("gpt-3.5-turbo")) {
    console.warn(
      "Warning: gpt-3.5-turbo may update over time. Returning num tokens assuming gpt-3.5-turbo-0613."
    );
    return numTokensFromMessages(messages, "gpt-3.5-turbo-0613");
  } else if (model.includes("gpt-4")) {
    console.warn(
      "Warning: gpt-4 may update over time. Returning num tokens assuming gpt-4-0613."
    );
    return numTokensFromMessages(messages, "gpt-4-0613");
  } else {
    throw new Error(
      `numTokensFromMessages() is not implemented for model ${model}. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.`
    );
  }

  let numTokens: number = 0;
  for (const message of messages) {
    numTokens += tokensPerMessage;
    for (const [key, value] of Object.entries(message)) {
      numTokens += encoding.encode(value).length;
      if (key === "name") {
        numTokens += tokensPerName;
      }
    }
  }

  numTokens += 3;
  return numTokens;
};

export const getOnlyContentTokenLength = (
  messages: Message[],
  model: TiktokenModel
) => {
  let string = "";

  for (const message of messages) {
    const { content } = message;
    string += "\n" + content;
  }

  const encoding = encodingForModel(model);
  return encoding.encode(string).length;
};

export const enc = encodingForModel("gpt-3.5-turbo-0125");

export const getTokenLength = (content: string, model?: TiktokenModel) => {
  const tokenList = enc.encode(content);
  return tokenList.length;
};

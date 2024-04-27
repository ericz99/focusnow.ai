import { nanoid } from "nanoid";
import { prisma } from "..";

import type { ChatHistoryCreationSchema } from "@/lib/schemas/chat";

import type { RequestCreationSchema } from "@/lib/schemas/request";

import type { UsageCreationSchema } from "@/lib/schemas/usage";

export const createChatHistory = async ({
  id,
  name,
  assistantId,
  request,
}: ChatHistoryCreationSchema & {
  assistantId: string;
} & {
  request: string[];
}) => {
  try {
    const chatHistory = await prisma.assistantChatHistory.create({
      data: {
        id: id ?? nanoid(),
        name,
        assistant: {
          connect: {
            id: assistantId,
          },
        },
        requests: {
          connect: request.map((reqId) => ({
            id: reqId,
          })),
        },
      },
      include: {
        requests: true,
      },
    });

    return chatHistory;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const createChatRequest = async ({
  usage,
  ...rest
}: RequestCreationSchema & {
  usage?: UsageCreationSchema;
}) => {
  try {
    if (usage) {
      return await prisma.request.create({
        data: {
          ...rest,
          usage: {
            create: {
              ...usage,
            },
          },
        },
      });
    }

    return await prisma.request.create({
      data: {
        ...rest,
      },
    });
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const addRequestToHistory = async (id: string, requests: string[]) => {
  try {
    const chatHistory = await prisma.assistantChatHistory.update({
      where: {
        id,
      },
      data: {
        requests: {
          connect: requests.map((reqId) => ({
            id: reqId,
          })),
        },
      },
    });

    return chatHistory;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const getChatHistoryById = async (id: string) => {
  try {
    const history = await prisma.assistantChatHistory.findFirst({
      where: {
        id,
      },
      include: {
        requests: true,
      },
    });

    return history;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

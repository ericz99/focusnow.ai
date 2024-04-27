import { prisma } from "..";

import type {
  AssistantCreationSchema,
  AssistantMutationSchema,
} from "@/lib/schemas/assistant";

import type { ToolSchema } from "@/lib/schemas/tool";

export const createAssistant = async (
  teamId: string,
  data: AssistantCreationSchema
) => {
  try {
    const assistant = await prisma.assistant.create({
      data: {
        ...data,
        team: {
          connect: {
            id: teamId,
          },
        },
      },
      include: {
        team: true,
        chatHistory: {
          include: {
            requests: true,
          },
        },
        documents: true,
      },
    });

    return assistant;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type AssistantItemIncluded = Awaited<ReturnType<typeof createAssistant>>;

export const getTeamAssistants = async (teamId: string) => {
  try {
    const assistants = await prisma.assistant.findMany({
      where: {
        team: {
          id: {
            contains: teamId,
          },
        },
      },
      include: {
        team: true,
      },
    });

    return assistants;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const updateAssistant = async (
  id: string,
  data: AssistantMutationSchema
) => {
  try {
    const res = await prisma.assistant.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return res;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const updateAssistantSettings = async (id: string, data: ToolSchema) => {
  try {
    const res = await prisma.assistant.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return res;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const deleteAssistant = async (id: string) => {
  try {
    await Promise.all([
      prisma.assistant.update({
        where: {
          id,
        },
        data: {
          chatHistory: {
            deleteMany: {},
          },
          documents: {
            deleteMany: {},
          },
          folders: {
            deleteMany: {},
          },
        },
      }),
      prisma.assistant.delete({
        where: {
          id,
        },
      }),
    ]);
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

// # TODO: maybe protect incase someone try to query existing assistant
export const getAssistantById = async (id: string) => {
  try {
    const assistant = await prisma.assistant.findFirst({
      where: {
        id,
      },
      include: {
        team: true,
        chatHistory: {
          include: {
            requests: true,
          },
        },
        documents: true,
      },
    });

    return assistant;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

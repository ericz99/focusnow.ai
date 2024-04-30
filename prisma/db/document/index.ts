import { prisma } from "..";

import type {
  DocumentSchema,
  DocumentChunkSchema,
} from "@/lib/schemas/document";

export const getDocuments = async (userId: string) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        user: {
          supaUserId: userId,
        },
      },
      include: {
        user: true,
      },
    });

    return documents;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const createDocument = async (
  data: DocumentSchema & {
    userId: string;
  }
) => {
  try {
    const { userId, ...rest } = data;

    const document = await prisma.document.create({
      data: {
        ...rest,
        user: {
          connect: {
            supaUserId: userId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return document;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type DocumentItemIncluded = Awaited<ReturnType<typeof createDocument>>;

export const createDocumentChunk = async (
  data: DocumentChunkSchema & {
    documentId: string;
  }
) => {
  try {
    const { documentId, ...rest } = data;

    const documentChunk = await prisma.documentChunk.create({
      data: {
        ...rest,
        document: {
          connect: {
            id: documentId,
          },
        },
      },
    });

    return documentChunk;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const deleteDocument = async (id: string) => {
  try {
    await Promise.all([
      prisma.document.update({
        where: {
          id,
        },
        data: {
          documentChunks: {
            deleteMany: {},
          },
        },
        include: {
          documentChunks: true,
        },
      }),
      await prisma.document.delete({
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

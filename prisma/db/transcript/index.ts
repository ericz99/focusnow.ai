import { prisma } from "..";

export const createTranscript = async ({
  sessionId,
  role,
  ...rest
}: {
  id: string;
  role: any;
  content: string;
  sessionId: string;
}) => {
  try {
    await prisma.transcript.create({
      data: {
        type: role,
        ...rest,
        session: {
          connect: {
            id: sessionId,
          },
        },
      },
    });

    return true;
  } catch (error) {
    console.error(error);
  }

  return false;
};

export const getAllTranscript = async (sessionId: string) => {
  try {
    const transcripts = await prisma.transcript.findMany({
      where: {
        sessionId,
      },
      include: {
        session: true,
      },
    });

    return transcripts;
  } catch (error) {
    console.error(error);
  }

  return null;
};

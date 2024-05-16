import * as z from "zod";
import { prisma } from "..";

export const sessionSchema = z.object({
  name: z.string(),
  totalTime: z.string().nullable(),
  resumeId: z.string(),
  coverLetterId: z.string().nullable(),
  jobId: z.string(),
  additionalInfo: z.string().nullable(),
});

export type SessionSchema = z.infer<typeof sessionSchema>;

export const createSession = async (
  data: SessionSchema & {
    userId: string;
  }
) => {
  const { userId, totalTime, ...rest } = data;

  try {
    const session = await prisma.session.create({
      data: {
        ...rest,
        totalTime: !totalTime ? "45_Minute" : totalTime,
        user: {
          connect: {
            supaUserId: userId,
          },
        },
      },
    });

    return session;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type SessionItemIncluded = Awaited<ReturnType<typeof createSession>>;

export const getUserSession = async (id: string) => {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        user: {
          supaUserId: id,
        },
      },
    });

    return sessions;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const getSession = async (id: string) => {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id,
      },
    });

    return session;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const deleteSession = async (id: string) => {
  try {
    await prisma.session.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("error occured", error);
  }

  return false;
};

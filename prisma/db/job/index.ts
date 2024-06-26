import * as z from "zod";
import { prisma } from "..";

export const jobSchema = z.object({
  position: z.string(),
  company: z.string(),
  companyDetail: z.string(),
  jobDescription: z.string(),
});

export type JobSchema = z.infer<typeof jobSchema>;

export const createJob = async (
  data: JobSchema & {
    userId: string;
  }
) => {
  const { userId, ...rest } = data;

  try {
    const job = await prisma.job.create({
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

    return job;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type JobItemIncluded = Awaited<ReturnType<typeof createJob>>;

export const getUserJobs = async (id: string) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        user: {
          supaUserId: id,
        },
      },
      include: {
        user: true,
      },
    });

    return jobs;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const getJob = async (id: string) => {
  try {
    const jobs = await prisma.job.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    return jobs;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const archiveJob = async (id: string) => {
  try {
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        isArchived: true,
      },
    });
  } catch (error) {
    console.error("error occured", error);
  }

  return false;
};

export const restoreJob = async (id: string) => {
  try {
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        isArchived: false,
      },
    });
  } catch (error) {
    console.error("error occured", error);
  }

  return false;
};

export const updateJob = async (
  data: JobSchema & {
    id: string;
  }
) => {
  const { id, ...rest } = data;

  try {
    const job = await prisma.job.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });

    return job;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

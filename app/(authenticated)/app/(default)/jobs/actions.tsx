"use server";

import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth";
import {
  JobItemIncluded,
  archiveJob,
  JobSchema,
  createJob,
} from "@/prisma/db/job";

export const createJobAction = async (data: JobSchema) => {
  "use server";

  const user = await checkAuth();
  const job = await createJob({
    ...data,
    userId: user.id,
  });

  if (!job) {
    throw new Error("Failed to create job, check log!");
  }

  revalidatePath("/app/jobs", "page");
};

export const archiveJobAction = async (data: JobItemIncluded[]) => {
  "use server";

  const ids = data.map((d) => d!.id);

  // # archive all ids
  await Promise.all(
    ids.map(async (id) => {
      await archiveJob(id);
    })
  );

  revalidatePath("/app/jobs", "page");
};

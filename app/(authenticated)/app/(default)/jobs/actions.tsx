"use server";

import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth";
import {
  JobItemIncluded,
  archiveJob,
  JobSchema,
  createJob,
  restoreJob,
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

export const archiveJobAction = async (data: JobItemIncluded[] | string) => {
  "use server";

  if (typeof data == "string") {
    await archiveJob(data);
  } else {
    const ids = data.map((d) => d!.id);

    // # archive all ids
    await Promise.all(
      ids.map(async (id) => {
        await archiveJob(id);
      })
    );
  }

  revalidatePath("/app/jobs", "page");
};

export const restoreJobAction = async (data: JobItemIncluded[] | string) => {
  "use server";

  if (typeof data == "string") {
    await restoreJob(data);
  } else {
    const ids = data.map((d) => d!.id);

    // # restore all ids
    await Promise.all(
      ids.map(async (id) => {
        await restoreJob(id);
      })
    );
  }

  revalidatePath("/app/jobs", "page");
};

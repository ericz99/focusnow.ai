"use server";

import { revalidatePath } from "next/cache";

import { checkAuth } from "@/lib/auth";

import {
  createSession,
  deleteSession,
  SessionSchema,
} from "@/prisma/db/session";

export const createSessionActive = async (data: SessionSchema) => {
  "use server";

  const user = await checkAuth();
  const session = await createSession({
    ...data,
    userId: user.id,
  });

  if (!session)
    throw new Error("Failed to create interview session, check log!");

  revalidatePath("/app/interview", "page");
};

"use server";

import { revalidatePath } from "next/cache";

import { checkAuth } from "@/lib/auth";

import {
  createSession,
  SessionSchema,
  updateSession,
} from "@/prisma/db/session";

import { removeCreditFromUser } from "@/prisma/db/credit";

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

export const consumeCredit = async (sessionId: string) => {
  "use server";

  const user = await checkAuth();

  await removeCreditFromUser({
    userId: user.id,
  });

  await updateSession({
    id: sessionId,
    isActive: true,
  });

  revalidatePath("/app/interview", "page");
};

export const updateSessionData = async (data: {
  id: string;
  isFinished?: boolean;
  startTime?: string;
  endTime?: string;
}) => {
  "use server";

  await updateSession(data);

  revalidatePath("/app/interview", "page");
};

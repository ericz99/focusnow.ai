"use server";

import { revalidatePath } from "next/cache";

import { checkAuth } from "@/lib/auth";

import {
  createSession,
  SessionSchema,
  updateSession,
} from "@/prisma/db/session";

import { removeCreditFromUser } from "@/prisma/db/credit";
import { getUser } from "@/prisma/db/user";

export const createSessionActive = async (data: SessionSchema) => {
  "use server";

  const user = await checkAuth();

  const userData = await getUser({
    supaUserId: user.id,
  });

  // # if credit is not at bare minimum of 25
  if (userData!.credit < 25) {
    return {
      error:
        "Not enough credit, please purchase more credit or consider upgrading to a bigger plan.",
    };
  }

  const session = await createSession({
    ...data,
    userId: user.id,
  });

  if (!session)
    throw new Error("Failed to create interview session, check log!");

  revalidatePath("/app/interview", "page");

  return {
    error: null,
  };
};

export const consumeCredit = async (sessionId: string) => {
  "use server";

  const user = await checkAuth();

  const userData = await getUser({
    supaUserId: user.id,
  });

  // # if credit is not at bare minimum of 25
  if (userData!.credit < 25) {
    return {
      error:
        "Not enough credit, please purchase more credit or consider upgrading to a bigger plan.",
    };
  }

  await removeCreditFromUser({
    userId: user.id,
  });

  await updateSession({
    id: sessionId,
    isActive: true,
  });

  revalidatePath("/app/interview", "page");

  return {
    error: null,
  };
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

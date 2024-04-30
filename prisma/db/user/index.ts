import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/admin";
import { prisma } from "..";

import type { NewUserSchema, UpdateUserSchema } from "@/lib/schemas/user";
import { stripe } from "@/lib/stripe/config";

export const getUserData = async (user: User) => {
  try {
    const userData = await prisma.user.findFirst({
      where: {
        supaUserId: user!.id,
      },
      include: {
        credit: true,
        sessions: true,
        subs: true,
      },
    });

    return userData;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const getUser = async (data: {
  id?: string;
  supaUserId?: string;
  email?: string;
}) => {
  const { id, email, supaUserId } = data;

  try {
    const userData = await prisma.user.findFirst({
      where: {
        id,
        email,
        supaUserId,
      },
      include: {
        credit: true,
        subs: true,
        sessions: true,
      },
    });

    return userData;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type UserData = Awaited<ReturnType<typeof getUserData>>;

export const checkIfHasUser = async ({ email }: { email: string }) => {
  try {
    const hasUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!hasUser) return false;
    return true;
  } catch (error) {
    console.error("error occured", error);
  }

  return false;
};

export const createNewUser = async ({ supaUserId, email }: NewUserSchema) => {
  try {
    // # create new stripe customer because it will always be brand new
    const stripeCustomer = await stripe.customers.create({
      email,
      metadata: {
        supaUserId,
      },
    });

    if (!stripeCustomer) {
      throw new Error("Failed to create stripe customer.");
    }

    const user = await prisma.user.create({
      data: {
        email,
        supaUserId,
        stripeUserId: stripeCustomer.id,
      },
    });

    return user;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type UserCreatedItemIncluded = Awaited<ReturnType<typeof createNewUser>>;

import * as z from "zod";
import { User } from "@supabase/supabase-js";
import { prisma } from "..";
import { stripe } from "@/lib/stripe/config";

export const magicLinkSchema = z.object({
  email: z.string().email(),
});

export type MagicLinkSchema = z.infer<typeof magicLinkSchema>;

export const newUserSchema = z.object({
  supaUserId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
});

export type NewUserSchema = z.infer<typeof newUserSchema>;

export const inviteUserSchema = z.object({
  email: z.string().email().optional(),
});

export type InviteUserSchema = z.infer<typeof inviteUserSchema>;

export const updateUserSchema = z.object({
  password: z.string().min(6).max(20),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const emailUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export type EmailUserSchema = z.infer<typeof emailUserSchema>;

export const getUserData = async (user: User) => {
  try {
    const userData = await prisma.user.findFirst({
      where: {
        supaUserId: user!.id,
      },
      include: {
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
        subs: true,
        sessions: true,
        paymentHistory: true,
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

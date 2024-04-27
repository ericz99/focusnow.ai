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
        teams: {
          select: {
            team: {
              include: {
                owner: true,
                assistants: true,
              },
            },
          },
        },
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
        teams: {
          select: {
            team: {
              include: {
                owner: true,
                assistants: true,
              },
            },
          },
        },
        subs: true,
      },
    });

    return userData;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const createDefaultEnvironment = async (user: User) => {
  try {
    const curUser = await prisma.user.findFirst({
      where: {
        supaUserId: user!.id,
      },
      include: {
        teams: true,
        owners: true,
        subs: true,
      },
    });

    console.log(curUser);

    // # create default team
    await prisma.team.create({
      data: {
        owner: {
          connect: {
            id: curUser!.id,
          },
        },
        members: {
          create: [
            {
              user: {
                connect: {
                  id: curUser!.id,
                },
              },
              roles: {
                create: [
                  {
                    role: "owner",
                  },
                  {
                    role: "admin",
                  },
                  {
                    role: "member",
                  },
                ],
              },
            },
          ],
        },
        name: "Default Team",
      },
    });
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

export const updateUser = async (
  code: string,
  updatedData: UpdateUserSchema
) => {
  const supabase = createClient();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const invite = await prisma.invite.findFirst({
        where: {
          code,
        },
      });

      if (!invite) throw new Error("Invite code is invalid!");

      const user = await tx.user.findFirst({
        where: {
          email: invite.recipientEmail,
        },
      });

      if (!user) throw new Error("Failed to fetch user!");

      const { password } = updatedData;

      // # create new supabase user
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password,
        email_confirm: true,
      });

      if (error) throw error;

      // # create new stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supaUserId: data.user.id,
        },
      });

      // # update user
      const _updatedUser = await tx.user.update({
        where: {
          email: invite.recipientEmail,
        },
        data: {
          supaUserId: data.user.id,
          stripeUserId: stripeCustomer.id,
        },
        include: {
          teams: true,
        },
      });

      return _updatedUser;
    });

    return result;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const getUserTeams = async (userId: string) => {
  try {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            user: {
              supaUserId: userId,
            },
          },
        },
      },
    });

    return teams;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type UserTeamsItemIncluded = Awaited<ReturnType<typeof getUserTeams>>;

export type UserCreatedItemIncluded = Awaited<ReturnType<typeof createNewUser>>;

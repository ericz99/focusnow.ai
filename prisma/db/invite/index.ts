import { User } from "@supabase/supabase-js";
import { prisma } from "..";

import { createNewUser, checkIfHasUser } from "@/prisma/db/user";

export interface InviteData {
  teamId: string;
  email: string;
}

export const createInvite = async (data: InviteData) => {
  const { email, teamId } = data;

  try {
    const invite = await prisma.invite.create({
      data: {
        team: {
          connect: {
            id: teamId,
          },
        },
        recipientEmail: email,
      },
    });

    // # create a new temp user that doesnt have stripe customer or supabase user created
    const tempUser = await prisma.user.create({
      data: {
        email,
      },
    });

    // # then join it into the teammembers in the team
    await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        members: {
          create: [
            {
              user: {
                connect: {
                  id: tempUser.id,
                },
              },
              roles: {
                create: [
                  {
                    role: "member",
                  },
                ],
              },
            },
          ],
        },
      },
    });

    return invite;
  } catch (error) {
    console.error("error occurred");
  }

  return null;
};

export const checkInviteCode = async (code: string) => {
  const invite = await prisma.invite.findFirst({
    where: {
      code,
    },
    include: {
      team: true,
    },
  });

  return invite;
};

export const acceptInvite = async (
  user: {
    id: string;
    email: string;
  },
  code: string
) => {
  // # we need to update the invite and create new user + add them into the workspace
  const invite = await prisma.invite.update({
    where: {
      code,
    },
    data: {
      accepted: true,
    },
  });

  const { id, email } = user;
  const hasUser = await checkIfHasUser({ email: email! });

  if (!hasUser) {
    // # create new user
    const user = await createNewUser({
      supaUserId: id,
      email: email!,
    });

    if (!user) {
      throw new Error("Failed to create new user.");
    }

    // # instead of creating a default we will add them into the team environment instead
    await prisma.team.update({
      where: {
        id: invite.teamId,
      },
      data: {
        members: {
          create: [
            {
              user: {
                connect: {
                  id: user.id,
                },
              },
              roles: {
                create: [
                  {
                    role: "member",
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }
};

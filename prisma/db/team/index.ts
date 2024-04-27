import { prisma } from "..";

import type {
  TeamCreationSchema,
  TeamMutationSchema,
} from "@/lib/schemas/team";

export const createTeam = async (userId: string, data: TeamCreationSchema) => {
  const { name } = data;

  try {
    const team = await prisma.team.create({
      data: {
        owner: {
          connect: {
            supaUserId: userId,
          },
        },
        members: {
          create: [
            {
              user: {
                connect: {
                  supaUserId: userId,
                },
              },
            },
          ],
        },
        name,
      },
    });

    return team;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type TeamItemIncluded = Awaited<ReturnType<typeof createTeam>>;

export const isTeamOwner = async (userId: string, { id }: { id: string }) => {
  try {
    // # check ownership
    const isOwner = await prisma.team.findFirst({
      where: {
        AND: [
          {
            owner: {
              supaUserId: userId,
            },
          },
          {
            id: id,
          },
        ],
      },
    });

    if (!isOwner) return false;
    return true;
  } catch (error) {
    console.error("error occured", error);
  }

  return false;
};

export const isTeamMember = async (userId: string, { id }: { id: string }) => {
  try {
    // # check if team member
    const isMember = await prisma.team.findFirst({
      where: {
        AND: [
          {
            members: {
              some: {
                user: {
                  supaUserId: userId,
                },
              },
            },
          },
          {
            id: id,
          },
        ],
      },
    });

    if (!isMember) return false;
    return true;
  } catch (error) {
    console.error("error occured", error);
  }

  return false;
};

export const deleteTeamById = async ({ id }: { id: string }) => {
  try {
    await Promise.all([
      // # delete all relational data
      prisma.team.update({
        where: {
          id,
        },
        data: {
          members: {
            deleteMany: {},
          },
          assistants: {
            deleteMany: {},
          },
          invites: {
            deleteMany: {},
          },
        },
      }),
      // # then delete team
      prisma.team.delete({
        where: {
          id,
        },
      }),
    ]);
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const getTeamById = async (userId: string, { id }: { id: string }) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        AND: [
          {
            members: {
              some: {
                user: {
                  supaUserId: userId,
                },
              },
            },
          },
          {
            id: id,
          },
        ],
      },
      include: {
        members: true,
      },
    });

    return team;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const updateTeam = async (id: string, data: TeamMutationSchema) => {
  try {
    const res = await prisma.team.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return res;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

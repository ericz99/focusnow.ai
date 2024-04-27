import { prisma } from "..";

export const getTeamMemberData = async (userId: string, teamId: string) => {
  try {
    const members = await prisma.teamMember.findFirst({
      where: {
        AND: [
          {
            userId,
          },
          {
            teamId,
          },
        ],
      },
      include: {
        user: true,
        team: {
          include: {
            invites: true,
          },
        },
        roles: true,
      },
    });

    return members;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const getTeamMembers = async (teamId: string) => {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        teamId,
      },
      include: {
        user: true,
        team: {
          include: {
            invites: true,
          },
        },
        roles: true,
      },
    });

    return members;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type TeamMemberIncluded = NonNullable<
  Awaited<ReturnType<typeof getTeamMemberData>>
>;

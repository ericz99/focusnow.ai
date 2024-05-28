import { prisma } from "..";

export const addCreditToUser = async ({
  userId,
  qty,
}: {
  userId: string;
  qty: number;
}) => {
  try {
    await prisma.user.update({
      where: {
        stripeUserId: userId,
      },
      data: {
        credit: {
          increment: qty,
        },
      },
    });
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const removeCreditFromUser = async ({ userId }: { userId: string }) => {
  try {
    await prisma.user.update({
      where: {
        supaUserId: userId,
      },
      data: {
        credit: {
          decrement: 25, // default credit cost about 25,
        },
      },
    });
  } catch (error) {
    console.error(error);
  }

  return null;
};

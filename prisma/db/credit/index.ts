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

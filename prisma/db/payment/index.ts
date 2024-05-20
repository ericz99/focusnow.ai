import { prisma } from "..";

export const createPayment = async ({
  userId,
  sessionId,
}: {
  userId: string;
  sessionId: string;
}) => {
  try {
    const payment = await prisma.paymentHistory.create({
      data: {
        user: {
          connect: {
            stripeUserId: userId,
          },
        },
        stripeCheckoutSessionId: sessionId,
      },
    });

    return payment;
  } catch (error) {
    console.error(error);
  }

  return null;
};

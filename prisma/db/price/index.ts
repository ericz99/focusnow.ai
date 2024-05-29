import { prisma } from "..";
import { Stripe } from "stripe";

export const getPrices = async () => {
  try {
    const prices = await prisma.price.findMany({
      include: {
        subs: true,
      },
    });

    return prices;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export const getPrice = async (id: string) => {
  try {
    const price = await prisma.price.findFirst({
      where: {
        id,
      },
    });

    return price;
  } catch (error) {
    console.error("error occured", error);
  }

  return null;
};

export type PriceItemIncluded = Awaited<ReturnType<typeof getPrice>>;

export const upsertPrice = async (data: Stripe.Price) => {
  try {
    const { id, unit_amount: unitAmount, recurring, product, ...rest } = data;

    const price = await prisma.price.create({
      data: {
        id,
        ...rest,
        unitAmount: unitAmount as number,
        interval: recurring!.interval as "month" | "year",
        intervalCount: recurring!.interval_count,
        product: {
          connect: {
            id: product as string,
          },
        },
        trialPeriodDay: recurring?.trial_period_days || 0,
      },
      include: {
        subs: true,
      },
    });

    return price;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const deletePrice = async (data: Stripe.Price) => {
  try {
    await prisma.price.delete({
      where: {
        id: data.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

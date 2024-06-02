import { prisma } from "..";
import { stripe } from "@/lib/stripe/config";
import { toDateTime } from "@/lib/utils";

export const updateSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string
) => {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          stripeUserId: customerId,
        },
        include: {
          sub: true,
        },
      });

      if (!user) throw new Error("Failed to find user!");

      const { sub } = user;

      if (!sub) throw new Error("User have no sub!");

      const {
        metadata,
        status,
        cancel_at_period_end,
        cancel_at,
        canceled_at,
        current_period_start,
        current_period_end,
        trial_start,
        trial_end,
        ended_at,
        created,
        items,
      } = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["default_payment_method"],
      });

      await tx.subscription.update({
        where: {
          id: sub!.id,
        },
        data: {
          id: subscriptionId,
          user: {
            connect: {
              id: user.id,
            },
          },
          price: {
            connect: {
              id: items.data[0].price.id,
            },
          },
          metadata,
          status,
          cancelAt: cancel_at ? toDateTime(cancel_at).toISOString() : null,
          canceledAt: canceled_at
            ? toDateTime(canceled_at).toISOString()
            : null,
          cancelAtPeriodEnd: cancel_at_period_end,
          currentPeriodStart: current_period_start
            ? toDateTime(current_period_start).toISOString()
            : null,
          currentPeriodEnd: current_period_end
            ? toDateTime(current_period_end).toISOString()
            : null,
          trialStart: trial_start
            ? toDateTime(trial_start).toISOString()
            : null,
          trialEnd: trial_end ? toDateTime(trial_end).toISOString() : null,
          endAt: ended_at ? toDateTime(ended_at).toISOString() : null,
          createdAt: toDateTime(created).toISOString(),
        },
      });
    });
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string
) => {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          stripeUserId: customerId,
        },
        include: {
          sub: true,
        },
      });

      if (!user) throw new Error("Failed to find user!");

      const {
        metadata,
        status,
        cancel_at_period_end,
        cancel_at,
        canceled_at,
        current_period_start,
        current_period_end,
        trial_start,
        trial_end,
        ended_at,
        created,
        items,
      } = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["default_payment_method"],
      });

      await tx.subscription.upsert({
        where: {
          id: subscriptionId,
        },
        update: {
          user: {
            connect: {
              id: user.id,
            },
          },
          metadata,
          status,
          cancelAt: cancel_at ? toDateTime(cancel_at).toISOString() : null,
          canceledAt: canceled_at
            ? toDateTime(canceled_at).toISOString()
            : null,
          cancelAtPeriodEnd: cancel_at_period_end,
          currentPeriodStart: current_period_start
            ? toDateTime(current_period_start).toISOString()
            : null,
          currentPeriodEnd: current_period_end
            ? toDateTime(current_period_end).toISOString()
            : null,
          trialStart: trial_start
            ? toDateTime(trial_start).toISOString()
            : null,
          trialEnd: trial_end ? toDateTime(trial_end).toISOString() : null,
          endAt: ended_at ? toDateTime(ended_at).toISOString() : null,
          createdAt: toDateTime(created).toISOString(),
        },
        create: {
          id: subscriptionId,
          price: {
            connect: {
              id: items.data[0].price.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          metadata,
          status,
          cancelAt: cancel_at ? toDateTime(cancel_at).toISOString() : null,
          canceledAt: canceled_at
            ? toDateTime(canceled_at).toISOString()
            : null,
          cancelAtPeriodEnd: cancel_at_period_end,
          currentPeriodStart: current_period_start
            ? toDateTime(current_period_start).toISOString()
            : null,
          currentPeriodEnd: current_period_end
            ? toDateTime(current_period_end).toISOString()
            : null,
          trialStart: trial_start
            ? toDateTime(trial_start).toISOString()
            : null,
          trialEnd: trial_end ? toDateTime(trial_end).toISOString() : null,
          endAt: ended_at ? toDateTime(ended_at).toISOString() : null,
          createdAt: toDateTime(created).toISOString(),
        },
      });
    });
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const getUserSubscription = async (id: string) => {
  try {
    const sub = await prisma.subscription.findFirst({
      where: {
        user: {
          supaUserId: id,
        },
      },
      include: {
        price: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return sub;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export type SubscriptionItemIncluded = Awaited<
  ReturnType<typeof getUserSubscription>
>;

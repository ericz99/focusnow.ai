import { prisma } from "..";
import { stripe } from "@/lib/stripe/config";
import { toDateTime } from "@/lib/utils";
import Stripe from "stripe";

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
      } = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["default_payment_method"],
      });

      await tx.subscription.update({
        where: {
          id: subscriptionId,
        },
        data: {
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

"use server";

import { updateSubscriptionStatusChange } from "@/prisma/db/subscription";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

export const updateSubscription = async (
  sub: Stripe.Subscription | undefined
) => {
  if (!sub) {
    return {
      error: "Something happened, please try again or contact support!",
    };
  }

  await updateSubscriptionStatusChange(sub.id, sub.customer as string);

  revalidatePath("/app/billing", "page");

  return {
    error: null,
  };
};

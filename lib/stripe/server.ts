"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe/config";
import { getUserData } from "@/prisma/db/user";
import { createClient } from "@/lib/supabase/server";
import { getURL, calculateTrialEndUnixTimestamp } from "@/lib/utils";

import { PriceItemIncluded } from "@/prisma/db/price";

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function createStripePortal(currentPath: string) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // # if user redirect them to dashboard
    if (!user) {
      console.error(error);
      throw new Error("Not authenticated!");
    }

    // # get user data
    const _user = await getUserData(user);

    if (!_user) {
      throw new Error("Failed to get user data!");
    }

    if (!_user.stripeUserId) {
      throw new Error("Stripe customer need to be generated!");
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer: _user.stripeUserId,
        return_url: getURL(`/app/billing`),
      });

      if (!url) {
        throw new Error("Failed to create stripe billing portal!");
      }

      return url;
    } catch (error) {
      console.error(error);
      throw new Error("Could not create billing portal");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}

export async function updateSubscription(
  price: PriceItemIncluded,
  subId: string,
  cusId: string
) {
  console.log("newprice", price);

  try {
    const subscriptionItems = await stripe.subscriptionItems.list({
      limit: 3,
      subscription: subId,
    });

    const getOldSubItemId = subscriptionItems.data[0].id;

    const sub = await stripe.subscriptions.update(subId, {
      items: [
        {
          id: getOldSubItemId,
          deleted: true,
        },
        {
          price: price?.id,
        },
      ],
      default_payment_method: "",
    });

    return JSON.stringify(sub);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}

export async function checkoutWithStripe(
  price: PriceItemIncluded,
  redirectPath: string,
  options?: {
    quantity: number;
  }
): Promise<CheckoutResponse> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // # if user redirect them to dashboard
    if (!user) {
      console.error(error);
      throw new Error("Not authenticated!");
    }

    // # get user data
    const _user = await getUserData(user);

    if (!_user) {
      throw new Error("Failed to get user data!");
    }

    if (!_user.stripeUserId) {
      throw new Error("Stripe customer need to be generated!");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer: _user.stripeUserId,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price!.id,
          quantity: options?.quantity ?? 1,
        },
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
    };

    if (price!.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price!.trialPeriodDay),
        },
      };
    } else if (price!.type === "one_time") {
      params = {
        ...params,
        mode: "payment",
      };
    }

    // # Create a checkout session in Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error("Unable to create checkout session.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return {
        errorRedirect: redirectPath,
      };
    }
  }

  return {
    sessionId: undefined,
    errorRedirect: undefined,
  };
}

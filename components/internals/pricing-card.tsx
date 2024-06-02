"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PriceItemIncluded } from "@/prisma/db/price";
import { updateSubscription as stripeUpdateSub } from "@/lib/stripe/server";
import { SubscriptionItemIncluded } from "@/prisma/db/subscription";
import { toast } from "sonner";
import Stripe from "stripe";

interface PricingCardProps {
  name: string;
  description: string;
  unitAmount: number;
  isFree?: boolean;
  featureListItems: string[];
  isBestPlan?: boolean;
  price: PriceItemIncluded;
  sub: SubscriptionItemIncluded;
  intervalCount: number;
  updateSubscription: (sub: Stripe.Subscription | undefined) => Promise<
    | {
        error: string;
      }
    | {
        error: null;
      }
  >;
}

export function PricingCard({
  featureListItems,
  name,
  description,
  isFree,
  unitAmount,
  isBestPlan,
  price,
  sub,
  intervalCount,
  updateSubscription,
}: PricingCardProps) {
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleStripeCheckout = async (price: PriceItemIncluded) => {
    setPriceIdLoading(price!.id);
    const updatedSub = await stripeUpdateSub(
      price,
      sub!.id,
      sub!.user.stripeUserId!
    );
    setPriceIdLoading(undefined);

    if (!updatedSub) {
      toast("Something happened, please retry again or contact support!");
      return;
    }

    const parsed = JSON.parse(updatedSub!) as Stripe.Subscription;
    await updateSubscription(parsed);
    toast("Succesfully updated subscription!");
  };

  return (
    <div
      className={cn(
        "relative flex w-full max-w-[400px] flex-col gap-4 overflow-hidden rounded-2xl border border-solid border-zinc-200 p-4 text-black dark:text-white",
        isBestPlan && "border-2 shadow-xl border-black shadow-emerald-400"
      )}
    >
      <div className="flex items-center">
        <div className="ml-4">
          <h2 className="text-base font-semibold leading-7">{name}</h2>
          <p className="h-16 text-sm leading-5 text-black/70 dark:text-white">
            {description}
          </p>
        </div>
      </div>

      <div
        className="flex flex-row gap-1"
        style={{ opacity: 1, transform: "none" }}
      >
        <span className="text-4xl font-bold text-black dark:text-white">
          ${unitAmount}
          {!isFree && <span className="text-xs">/ {intervalCount} Month</span>}
        </span>
      </div>

      <Button
        variant={"default"}
        size={"lg"}
        className="text-xl"
        disabled={priceIdLoading == price?.id}
        onClick={() => handleStripeCheckout(price)}
      >
        {sub?.price.id == price?.id ? "Current Plan" : "Upgrade / Downgrade"}
      </Button>

      <ul className="flex flex-col gap-2 font-normal">
        {featureListItems.map((f, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 text-xs font-medium text-black dark:text-white"
          >
            <CircleCheck size={20} color="green" />

            <span className="flex">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

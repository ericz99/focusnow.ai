"use client";

import React from "react";
import Stripe from "stripe";
import { ProductItemIncluded } from "@/prisma/db/product";
import { PricingCard } from "@/components/internals/pricing-card";
import { SubscriptionItemIncluded } from "@/prisma/db/subscription";

interface PricingPlanProps {
  products: ProductItemIncluded[];
  sub: SubscriptionItemIncluded;
  updateSubscription: (sub: Stripe.Subscription | undefined) => Promise<
    | {
        error: string;
      }
    | {
        error: null;
      }
  >;
}

export function PricingPlan({
  products,
  sub,
  updateSubscription,
}: PricingPlanProps) {
  return (
    <div className="mx-auto grid w-full justify-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <PricingCard
          key={p!.id}
          sub={sub}
          price={p!.price!}
          name={p!.name}
          description={p!.description!}
          unitAmount={p!.price!.unitAmount}
          isBestPlan={p!.name == "Pro Plan"}
          intervalCount={p!.price!.intervalCount}
          updateSubscription={updateSubscription}
          featureListItems={
            JSON.parse(JSON.stringify(p!.metadata)).features as string[]
          }
        />
      ))}
    </div>
  );
}

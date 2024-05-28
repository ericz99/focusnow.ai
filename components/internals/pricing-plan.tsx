"use client";

import React from "react";

import { ProductItemIncluded } from "@/prisma/db/product";
import { PricingCard } from "@/components/internals/pricing-card";

interface PricingPlanProps {
  products: ProductItemIncluded[];
}

export function PricingPlan({ products }: PricingPlanProps) {
  return (
    <div className="mx-auto grid w-full justify-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <PricingCard
          key={p!.id}
          name={p!.name}
          description={p!.description!}
          price={p!.price!.unitAmount}
          featureListItems={[
            "Advanced AI insights",
            "Priority support",
            "Unlimited projects",
            "Access to all AI tools",
            "Custom integrations",
          ]}
        />
      ))}
    </div>
  );
}

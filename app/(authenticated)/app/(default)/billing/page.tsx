import React from "react";
import { getUserSubscription } from "@/prisma/db/subscription";
import { checkAuth } from "@/lib/auth";

import { CustomerPortalForm } from "@/components/internals/customer-portal-form";
import { getProducts } from "@/prisma/db/product";
import { PricingPlan } from "@/components/internals/pricing-plan";
import { Separator } from "@/components/ui/separator";

export default async function BillingPage() {
  const user = await checkAuth();
  const sub = await getUserSubscription(user.id);
  const products = await getProducts();

  // # get only type of recurring
  const recurringPlans = products?.filter((p) => p.price?.type == "recurring");

  return (
    <div className="container relative mx-auto max-w-screen-2xl pt-12 px-4 md:px-8">
      <div className="flex flex-col gap-4 relative mb-12">
        <h1 className="text-4xl font-semibold">Billing</h1>
      </div>

      <CustomerPortalForm sub={sub} />

      <Separator className="mb-8" />

      <PricingPlan sub={sub} products={recurringPlans ?? []} />
    </div>
  );
}

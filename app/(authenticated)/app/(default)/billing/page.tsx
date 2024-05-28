import React from "react";
import { getUserSubscription } from "@/prisma/db/subscription";
import { checkAuth } from "@/lib/auth";

import { CustomerPortalForm } from "@/components/internals/customer-portal-form";
import { getProducts } from "@/prisma/db/product";
import { PricingPlan } from "@/components/internals/pricing-plan";

export default async function BillingPage() {
  const user = await checkAuth();
  const sub = await getUserSubscription(user.id);
  const products = await getProducts();

  // # get only type of recurring
  const recurringPlans = products?.filter((p) => p.price?.type == "recurring");

  return (
    <div className="container relative mx-auto max-w-screen-2xl pt-12 px-4 md:px-8">
      <CustomerPortalForm sub={sub} />
      <PricingPlan products={recurringPlans ?? []} />
    </div>
  );
}

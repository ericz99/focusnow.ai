"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SubscriptionItemIncluded } from "@/prisma/db/subscription";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createStripePortal } from "@/lib/stripe/server";
import { toast } from "sonner";

interface CustomerPortalFormProps {
  sub: SubscriptionItemIncluded;
}

export function CustomerPortalForm({ sub }: CustomerPortalFormProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    sub &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: sub?.price.currency,
      minimumFractionDigits: 0,
    }).format((sub?.price?.unitAmount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);

    if (!redirectUrl) {
      toast(
        "Failed to create stripe portal, please check with customer support or retry again!"
      );
    } else {
      return router.push(redirectUrl);
    }
  };

  return (
    <Card className="w-full m-auto my-8 border border-solid rounded-lg p border-zinc-200">
      <div className="px-5 py-4">
        <CardTitle className="text-xl">Your Plan</CardTitle>

        <CardDescription className="text-base">
          {sub
            ? `You are currently on the ${sub?.price?.product?.name} plan.`
            : "You are not currently subscribed to any plan."}
        </CardDescription>

        <CardContent className="p-0">
          <div className="mt-8 mb-4 font-semibold text-xl">
            {sub ? (
              `$${sub?.price?.unitAmount} / ${sub?.price?.intervalCount} ${sub?.price?.interval}`
            ) : (
              <Link href="/#">Choose your plan</Link>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-100 text-zinc-900">
        <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0 flex-1 font-semibold">
            Manage your subscription on Stripe.
          </p>
          <Button
            variant={"default"}
            onClick={handleStripePortalRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>Open customer portal</>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

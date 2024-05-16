"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SubscriptionItemIncluded } from "@/prisma/db/subscription";
import { Button } from "@/components/ui/button";

interface BillingFormButtonProps {
  sub: SubscriptionItemIncluded;
}

export function BillingFormButton({ sub }: BillingFormButtonProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <Button variant={"secondary"} className="h-14 w-full" size={"lg"} asChild>
        <Link href="/#">
          <div className="flex flex-col flex-1">
            Manage Subscription
            <p>
              Current Plan:{" "}
              <strong>{!sub ? "None" : sub.price.product.name}</strong>
            </p>
          </div>

          <ChevronRight size={20} />
        </Link>
      </Button>
    </div>
  );
}

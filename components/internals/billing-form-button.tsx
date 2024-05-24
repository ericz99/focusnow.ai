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
      <Link
        href="/app/billing"
        className="flex border border-solid border-zinc-300 justify-between items-center gap-8 w-full p-4 rounded-lg hover:bg-zinc-100 transition-all ease-in-out duration-75"
      >
        <div className="flex flex-col flex-1 text-black text-sm">
          Manage Subscription
          <p>
            Current Plan:{" "}
            <strong>{!sub ? "None" : sub.price.product.name}</strong>
          </p>
        </div>

        <ChevronRight color="#000000" size={20} />
      </Link>
    </div>
  );
}

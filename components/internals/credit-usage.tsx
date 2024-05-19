"use client";

import React from "react";
import { SubscriptionItemIncluded } from "@/prisma/db/subscription";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditForm } from "@/components/internals/credit-form";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PriceItemIncluded } from "@/prisma/db/price";

interface CreditUsageProps {
  sub: SubscriptionItemIncluded;
  price?: PriceItemIncluded;
}

export function CreditUsage({ sub, price }: CreditUsageProps) {
  return (
    <div className="flex items-center gap-4 relative w-full">
      <div className="w-full flex-1 flex items-center text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <AlertCircle size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-sm w-full ml-4">
                This displays the credit balance available for each Copilot
                session. To increase your balance, you can click the Add button
                for a one-time purchase or subscribe to a plan for discounted
                add-ons.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        Available Credit: <strong className="ml-2">{!sub ? "0" : "100"}</strong>
      </div>

      <CreditForm price={price} />
    </div>
  );
}

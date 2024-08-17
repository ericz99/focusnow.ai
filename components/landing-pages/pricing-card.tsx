"use client";

import React from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PriceItemIncluded } from "@/prisma/db/price";
import { useRouter } from "next/navigation";

interface PricingCardProps {
  name: string;
  description: string;
  unitAmount: number;
  isFree?: boolean;
  featureListItems: string[];
  isBestPlan?: boolean;
  price: PriceItemIncluded;
}

export function PricingCard({
  featureListItems,
  name,
  description,
  isFree,
  unitAmount,
  isBestPlan,
  price,
}: PricingCardProps) {
  const router = useRouter();

  const pushToLogin = () => {
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "relative flex w-full max-w-[500px] flex-col gap-8 overflow-hidden rounded-2xl border border-solid border-zinc-200 p-4 text-black dark:text-white",
        isBestPlan && "border-2 shadow-xl border-black shadow-emerald-400"
      )}
    >
      <div className="flex items-center">
        <div className="ml-4">
          <h2 className="text-base font-semibold leading-7">{name}</h2>
          <p className="h-16 text-xs leading-5 text-black/70 dark:text-white">
            {description}
          </p>
        </div>
      </div>

      <div
        className="flex flex-row gap-1"
        style={{ opacity: 1, transform: "none" }}
      >
        <span className="text-3xl font-bold text-black dark:text-white">
          ${unitAmount}
          {!isFree && (
            <span className="text-xs">
              / {price?.intervalCount} {price?.interval}
            </span>
          )}
        </span>
      </div>

      <Button
        variant={"default"}
        size={"lg"}
        className="text-xl"
        onClick={pushToLogin}
      >
        Subscribe
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

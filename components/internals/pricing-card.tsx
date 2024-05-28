"use client";

import React from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  isFree?: boolean;
  featureListItems: string[];
}

export function PricingCard({
  featureListItems,
  name,
  description,
  isFree,
  price,
}: PricingCardProps) {
  return (
    <div className="relative flex w-full max-w-[400px] flex-col gap-4 overflow-hidden rounded-2xl border border-solid border-zinc-200 p-4 text-black dark:text-white">
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
          ${price}
          {!isFree && <span className="text-xs">/Month</span>}
        </span>
      </div>

      <Button variant={"default"} size={"lg"} className="text-xl">
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

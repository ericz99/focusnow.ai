"use client";

import React from "react";
import { CircleX } from "lucide-react";
import { CreditForm } from "./credit-form";
import { PriceItemIncluded } from "@/prisma/db/price";

interface CreditNotificationProps {
  price?: PriceItemIncluded;
}

export function CreditNotification({ price }: CreditNotificationProps) {
  return (
    <div className="p-4 relative rounded-lg border border-solid border-zinc-200 flex flex-col justify-center items-center">
      <CircleX size={42} color="red" />

      <p className="text-base my-8 text-center font-semibold">
        Looks like you ran out of credit, please use the button below to
        purchase more credit or simply upgrade to a bigger plan.
      </p>

      <CreditForm price={price} textButton="Buy Credit" />
    </div>
  );
}

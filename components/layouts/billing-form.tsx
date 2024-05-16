"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { SubscriptionItemIncluded } from "@/prisma/db/subscription";

interface BillingFormProps {
  sub: SubscriptionItemIncluded;
}

export function BillingForm({ sub }: BillingFormProps) {
  return <div>billing-form</div>;
}

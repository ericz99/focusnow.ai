"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { getStripe } from "@/lib/stripe/client";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PriceItemIncluded } from "@/prisma/db/price";

interface CreditFormProps {
  price?: PriceItemIncluded;
}

export function CreditForm({ price }: CreditFormProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const currentPath = usePathname();

  const onHandleStripeCheckout = async () => {
    const { sessionId } = await checkoutWithStripe(price!, currentPath, {
      quantity,
    });

    console.log("sessionId", sessionId);

    if (sessionId) {
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Plus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Credit Add On</DialogTitle>
          <DialogDescription>
            1$ a credit, remember each session will consume 25 Credit.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col gap-4 relative">
          <Label>Credit Amount</Label>
          <Input
            type="number"
            min={1}
            max={500}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-solid"
          />
        </div>

        <Button
          type="button"
          onClick={onHandleStripeCheckout}
          className="lock w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
        >
          Purchase Now
        </Button>
      </DialogContent>
    </Dialog>
  );
}

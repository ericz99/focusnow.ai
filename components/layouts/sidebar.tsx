"use client";

import { useState, useEffect, useMemo, memo } from "react";
import {
  LayoutDashboard,
  Building2,
  BotMessageSquare,
  File,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { getMainRoute } from "@/lib/route";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/hooks";
import { ProfileToggle } from "@/components/internals/profile-toggle";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type { SubscriptionItemIncluded } from "@/prisma/db/subscription";
import { BillingFormButton } from "@/components/internals/billing-form-button";
import { CreditUsage } from "@/components/internals/credit-usage";
import type { PriceItemIncluded } from "@/prisma/db/price";

interface SidebarProps {
  sub: SubscriptionItemIncluded;
  pricings: PriceItemIncluded[];
  credit: number;
}

export function Sidebar({ sub, pricings, credit }: SidebarProps) {
  const { signOut, userData } = useUser();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const pathname = usePathname();
  const routes = getMainRoute();

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const creditOnlyPrice = useMemo(() => {
    return pricings.find((price) => price?.type == "one_time");
  }, [pricings]);

  return (
    <div className="w-[450px] flex flex-col relative h-full p-4 bg-white border-r border-solid border-zinc-200">
      <div className="flex-1 flex flex-col gap-1 relative">
        {routes.map((r, idx) => (
          <Link
            href={`${r.path}`}
            key={idx}
            aria-disabled={r.isDisabled}
            tabIndex={r.isDisabled ? -1 : undefined}
            className={cn(
              "text-base transition-all font-normal ease-in-out duration-75 rounded-md p-2 flex items-center gap-3 text-zinc-400",
              `${
                activeTab == r.path
                  ? "text-white bg-blue-500/80"
                  : "hover:bg-blue-400/60 hover:text-white"
              }`,
              `${r.isDisabled ? "pointer-events-none" : ""}`
            )}
          >
            {r.label == "Dashboard" && <LayoutDashboard size={20} />}
            {r.label == "Jobs" && <Building2 size={20} />}
            {r.label == "Interview Copilot" && <BotMessageSquare size={20} />}
            {r.label == "Documents" && <File size={20} />}

            {r.label}
          </Link>
        ))}

        <Separator className="my-6" />

        <div className="flex flex-col gap-4">
          <CreditUsage sub={sub} price={creditOnlyPrice} credit={credit} />
          <BillingFormButton sub={sub} />
        </div>
      </div>

      <ProfileToggle userData={userData!} signOut={signOut} />
    </div>
  );
}

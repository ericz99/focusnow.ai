import React from "react";

import { stripe } from "@/lib/stripe/config";
import { checkAuth } from "@/lib/auth";
import { getUserSubscription } from "@/prisma/db/subscription";
import { getPrices } from "@/prisma/db/price";
import { getUser } from "@/prisma/db/user";
import { Sidebar } from "@/components/layouts/sidebar";
import { MainNav } from "@/components/internals/main-nav";

export default async function MainDefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAuth();
  const sub = await getUserSubscription(user.id);
  const prices = await getPrices();

  const dbUser = await getUser({
    supaUserId: user.id,
  });

  // # grab all checkout session from customer
  const sessions = await Promise.all(
    dbUser!.paymentHistory.map((p) => {
      return stripe.checkout.sessions.retrieve(p.stripeCheckoutSessionId);
    })
  );

  // console.log("sessions", sessions);
  console.log("sub", sub);

  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      <Sidebar sub={sub} pricings={prices ?? []} credit={dbUser!.credit ?? 0} />
      <div className="flex flex-col relative h-full w-full bg-[#edf6f9]/30">
        <MainNav />

        {children}
      </div>
    </div>
  );
}

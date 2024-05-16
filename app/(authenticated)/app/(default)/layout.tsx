import React from "react";

import { checkAuth } from "@/lib/auth";
import { getUserSubscription } from "@/prisma/db/subscription";
import { Sidebar } from "@/components/layouts/sidebar";
import { WelcomeMessage } from "@/components/internals/welcome-message";

export default async function MainDefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAuth();
  const sub = await getUserSubscription(user.id);

  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      <Sidebar sub={sub} />
      <div className="flex flex-col relative h-full w-full bg-[#edf6f9]/30">
        <WelcomeMessage />

        {children}
      </div>
    </div>
  );
}

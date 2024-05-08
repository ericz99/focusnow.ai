import React from "react";

import { Sidebar } from "@/components/layouts/sidebar";
import { WelcomeMessage } from "@/components/internals/welcome-message";

export default function MainDefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      <Sidebar />
      <div className="flex flex-col relative h-full w-full bg-[#edf6f9]/30">
        <WelcomeMessage />

        {children}
      </div>
    </div>
  );
}

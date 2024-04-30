import React from "react";

import { Sidebar } from "@/components/layouts/sidebar";
import { WelcomeMessage } from "@/components/internals/welcome-message";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      <Sidebar />
      <div className="bg-[#faf4ea] flex flex-col relative h-full w-full">
        <WelcomeMessage />

        {children}
      </div>
    </div>
  );
}

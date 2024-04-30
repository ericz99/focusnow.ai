"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Code, BotMessageSquare, File } from "lucide-react";
import { usePathname } from "next/navigation";
import { getMainRoute } from "@/lib/route";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/hooks";
import { ProfileToggle } from "@/components/internals/profile-toggle";
import Link from "next/link";

export function Sidebar() {
  const { signOut, userData } = useUser();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const pathname = usePathname();
  const routes = getMainRoute();

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  return (
    <div className="w-[350px] flex flex-col relative h-full p-4 bg-zinc-900">
      <div className="flex-1 flex flex-col gap-1 relative">
        {routes.map((r, idx) => (
          <Link
            href={`${r.path}`}
            key={idx}
            aria-disabled={r.isDisabled}
            tabIndex={r.isDisabled ? -1 : undefined}
            className={cn(
              "text-base transition-all ease-in-out duration-75 rounded-md p-2 flex items-center gap-3 text-zinc-400",
              `${
                activeTab == r.path
                  ? "text-white font-semibold"
                  : "hover:bg-zinc-600 font-medium hover:text-white"
              }`,
              `${r.isDisabled ? "pointer-events-none" : ""}`
            )}
          >
            {r.label == "Dashboard" && <LayoutDashboard size={20} />}
            {r.label == "Code Copilot" && <Code size={20} />}
            {r.label == "Interview Copilot" && <BotMessageSquare size={20} />}
            {r.label == "Documents" && <File size={20} />}

            {r.label}
          </Link>
        ))}
      </div>

      <ProfileToggle userData={userData!} signOut={signOut} />
    </div>
  );
}

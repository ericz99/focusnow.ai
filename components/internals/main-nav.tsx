"use client";

import { useUser } from "@/lib/hooks";
import React from "react";

import { ProfileToggle } from "@/components/internals/profile-toggle";
import { Separator } from "@/components/ui/separator";

export function MainNav() {
  const { signOut, userData } = useUser();

  return (
    <div className="w-full flex items-center justify-end border-b border-solid border-zinc-200 p-2">
      <div className="flex gap-4 items-center">
        <p className="text-sm w-full text-light">
          Welcome Back, <strong>{userData?.email}</strong>
        </p>

        <Separator orientation="vertical" className="h-6 bg-zinc-200" />

        <ProfileToggle userData={userData!} signOut={signOut} />
      </div>
    </div>
  );
}

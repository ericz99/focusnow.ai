"use client";

import { useUser } from "@/lib/hooks";
import React from "react";

import { ProfileToggle } from "@/components/internals/profile-toggle";

const welcomeMessages = [
  "🤖: Welcome aboard Interview Copilot! Get ready to soar through your interview prep journey with our personalized guidance and support.",
  "🤖: Hey there! Welcome to Interview Copilot, where we're here to navigate you through the skies of successful interviews. Let's take off together!",
  "🤖: Welcome to Interview Copilot! Buckle up and enjoy the ride as we help you navigate the turbulence of job interviews with confidence and ease.",
  "🤖: Hello and welcome to Interview Copilot! Prepare for smooth sailing through your interview preparations with our expert guidance by your side.",
  "🤖: Welcome to Interview Copilot! Sit back, relax, and let us be your trusted co-pilots as you navigate the skies of career advancement.",
];

export function MainNav() {
  const { signOut, userData } = useUser();
  const rand = Math.floor(Math.random() * welcomeMessages.length);

  return (
    <div className="w-full flex border-b border-solid border-zinc-200">
      <div className="p-4 flex flex-1">
        <p className="text-xs w-full flex-1 italic font-bold">
          {welcomeMessages[rand]}
        </p>
      </div>

      <ProfileToggle userData={userData!} signOut={signOut} />
    </div>
  );
}

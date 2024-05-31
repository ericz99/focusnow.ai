"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";

export function HeroWithVideo() {
  return (
    <div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8 pt-20 text-center lg:pt-32 relative">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-balance bg-gradient-to-br from-black from-30% to-black/60 bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-7xl">
          ACE your interview using industry standard AI Copilot.
        </h1>
      </div>

      <p className="mx-auto max-w-[64rem] text-balance text-lg tracking-tight text-gray-500 md:text-xl">
        Transform your hiring process with the AI Interviewer Copilot.
        Automatically generate real-time transcriptions, and enhance interviews
        seamlessly. Make smarter, faster hiring decisions with ease.
      </p>

      <div className="flex justify-center items-center gap-4 mt-6 mb-4">
        <Button
          asChild
          size={"lg"}
          variant={"default"}
          className="border border-solid rounded-lg h-10"
        >
          <Link href="/login">Try Now</Link>
        </Button>
      </div>

      <div className="relative bg-white">
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-10xl text-center cursor-pointer border rounded-xl border-solid border-zinc-100 shadow-2xl">
            <div className="relative rounded-xl">
              <BorderBeam />

              <video
                src="copilot-demo1.mp4"
                className="rounded-xl shadow-2xl"
                autoPlay
                loop
                muted
              ></video>
            </div>
            {/* <div className="relative">
              <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[10%]" />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

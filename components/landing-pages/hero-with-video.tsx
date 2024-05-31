"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";

export function HeroWithVideo() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 text-center lg:pt-32 relative">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-balance bg-gradient-to-br from-black from-30% to-black/60 bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-7xl">
          ACE your interview using industry standard AI Copilot.
        </h1>
      </div>

      <p className="mx-auto max-w-[64rem] text-balance text-lg tracking-tight text-gray-500 md:text-xl">
        Revolutionize your hiring with AI Interviewer Copilot. Automate
        screening, streamline scheduling, and enhance interviews in real-time.
        Make smarter, faster hiring decisions effortlessly.
      </p>

      <div className="flex justify-center items-center gap-4 mt-6 mb-4">
        <Button
          asChild
          size={"lg"}
          variant={"outline"}
          className="border border-solid rounded-lg h-10"
        >
          <Link href="/login">Try Now</Link>
        </Button>
      </div>

      <div className="relative bg-white">
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl text-center cursor-pointer">
            <div className="relative rounded-xl">
              <BorderBeam />

              <Image
                src={"/demo-v1.png"}
                alt="demo-v1"
                height="1442"
                width="2432"
                decoding="async"
                priority
                className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10 transition-opacity duration-100 hover:opacity-50 cursor-pointer"
              />

              <div className="absolute inset-0 bg-white-500 hover:bg-slate-50 opacity-50 flex items-center justify-center rounded-xl transition-opacity duration-300">
                <div className="bg-black rounded-full p-4 -mt-24 opacity-100">
                  <PlayCircle className="text-white w-12 h-12 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-20 xl:w-20" />
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

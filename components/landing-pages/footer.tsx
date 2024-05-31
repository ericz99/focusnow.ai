import React from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function Footer() {
  return (
    <div className="w-full mx-auto max-w-7xl p-8 lg:px-0 relative rounded-lg border-t border-solid border-zinc-200 my-12">
      <div className="md:flex md:justify-between p-4 py-16 sm:pb-16 gap-4">
        <div className="mb-12 flex-col flex gap-4">
          <Link className="flex items-center gap-2" href="/">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Interview Pilot
            </span>
          </Link>
          <p className="max-w-xs">
            Interview Pilot is a AI Copilot software that will help you land
            your dream job!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-4">
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Legal
            </h2>

            <ul className="gap-2 grid">
              <li>
                <Link
                  href="/terms"
                  className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      <span className="text-zinc-400 text-sm">
        Copyright © 2024 Focusnow. All rights reserved.
      </span>
    </div>
  );
}

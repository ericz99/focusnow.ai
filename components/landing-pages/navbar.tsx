"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Squash as Hamburger } from "hamburger-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const $headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ($headerRef.current) {
      $headerRef.current.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
          console.log("hi");
          e.preventDefault();
          setOpen(false);
        }
      });
    }
  }, [$headerRef, open]);

  return (
    <header
      ref={$headerRef}
      className="max-w-7xl w-full mx-auto flex items-center justify-between px-6 py-2 lg:px-8 lg:py-4 lg:justify-start"
    >
      <div className="hidden lg:flex flex-1 w-full items-center justify-center pl-12 md:pl-24 gap-4 md:gap-12">
        <Link
          href={"#pricing"}
          className="relative text-base w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
        >
          Features
        </Link>

        <Link
          href={"#reviews"}
          className="relative text-base w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
        >
          Pricing
        </Link>

        <Link
          href={"#faq"}
          className="relative text-base w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
        >
          FAQ
        </Link>
      </div>

      <div className="hidden lg:flex gap-4">
        <Button asChild variant={"ghost"} className="text-base">
          <Link href="/login">Sign In</Link>
        </Button>

        <Button variant={"default"} asChild>
          <Link href="/login">Try It Out</Link>
        </Button>
      </div>

      <div className="gap-4 flex lg:hidden items-center justify-end">
        <Popover>
          <PopoverTrigger>
            <Button asChild>
              <Hamburger size={20} toggled={open} toggle={setOpen} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="h-full w-full p-0 mt-2">
            <div className="h-screen w-screen p-4 backdrop-blur-sm bg-slate-100">
              <div className="flex flex-col w-full items-center justify-center gap-8 mt-4">
                <Link href={"/examples"} className="text-lg">
                  Examples
                </Link>

                <Link href={"/integrations"} className="text-lg">
                  Integrations
                </Link>

                <Link href={"/pricing"} className="text-lg">
                  Pricing
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

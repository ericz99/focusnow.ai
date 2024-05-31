import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  title: string;
  heading: string;
  description: string;
  buttonText: string;
  videoName: string;
  direction?: "left" | "right";
}

export function FeatureSection({
  title,
  heading,
  description,
  buttonText,
  videoName,
  direction,
}: FeatureSectionProps) {
  return (
    <div className="mx-auto my-12 grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5">
      <div
        className={cn(
          "m-auto lg:col-span-2 text-left",
          direction == "right" && "lg:text-right lg:order-last"
        )}
      >
        <h2 className="text-base font-semibold leading-7 text-orange-600">
          {title}
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          {heading}
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <Button asChild variant={"default"} size={"lg"}>
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8 mt-6"
            href="/login"
          >
            {buttonText}
          </Link>
        </Button>
      </div>

      <video
        src={videoName}
        className={cn(
          "m-auto rounded-xl border shadow-2xl lg:col-span-3",
          direction == "right" && "lg:order-first"
        )}
        autoPlay
        loop
        muted
      ></video>
    </div>
  );
}

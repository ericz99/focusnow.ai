"use client";

import { spinner } from "@/components/ui/spinner";

export function EmptyScreen() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex flex-col flex-1 relative items-center">
        {spinner}
        <h1 className="text-2xl font-semibold">
          Waiting for data to come in...
        </h1>
      </div>
    </div>
  );
}

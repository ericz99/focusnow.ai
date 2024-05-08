import React from "react";

import { cn } from "@/lib/utils";
import { IconOpenAI, IconUser } from "@/components/ui/icon";

export interface NewMessage {
  role: "user" | "assistant" | "system" | "function";
  display: React.ReactNode;
}

export function NewMessage({ role, display }: NewMessage) {
  return (
    <div className="w-full text-slate-700">
      <div className="px-4 py-2 justify-center text-base md:gap-6 m-auto my-4">
        <div className="flex flex-1 text-base mx-auto gap-3 md:px-5 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group">
          <div className="flex-shrink-0 flex flex-col relative items-end">
            <div
              className={cn(
                "flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
                role === "user"
                  ? "bg-background"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {role === "user" ? <IconUser /> : <IconOpenAI />}
            </div>
          </div>

          <div className="relative flex w-full flex-col lg:w-[calc(100%-115px)]">
            <div className="font-semibold select-none">
              {role == "user" ? "User" : "Assistant"}
            </div>

            {display}
          </div>
        </div>
      </div>
    </div>
  );
}

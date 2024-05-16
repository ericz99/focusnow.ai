"use client";

import { useMemo } from "react";
import type { ClientMessage } from "@/lib/types";

import { Separator } from "@/components/ui/separator";
import { EmptyScreen } from "@/components/internals/empty-screen";

interface CopilotPanelProps {
  messages: ClientMessage[];
}

export function CopilotPanel({ messages }: CopilotPanelProps) {
  const copilotMessagesOnly = useMemo(() => {
    return messages.filter((m) => m.role == "assistant");
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col p-4 relative w-full h-full">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-orange-900">
        <div className="w-full rounded-t-lg p-3 bg-orange-900 text-lg text-white font-semibold">
          Copilot
        </div>

        <div className="h-full w-full flex flex-col relative">
          <div className="flex-1 mt-8 overflow-hidden">
            <div className="h-full overflow-y-auto w-full">
              {copilotMessagesOnly.length ? (
                <div className="flex flex-col pb-9 text-sm">
                  {copilotMessagesOnly.map(
                    (m: ClientMessage, index: number) => (
                      <div key={m.id}>
                        {m.display}

                        {index < copilotMessagesOnly.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <EmptyScreen />
              )}

              <div className="w-full h-2 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import type { ClientMessage } from "@/lib/types";

import { Separator } from "@/components/ui/separator";
import { EmptyScreen } from "@/components/internals/empty-screen";

interface CopilotPanelProps {
  messages: ClientMessage[];
  receiveData: boolean;
}

export function CopilotPanel({ messages, receiveData }: CopilotPanelProps) {
  const copilotMessagesOnly = useMemo(() => {
    return messages.filter((m) => m.role == "assistant");
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative w-full h-full">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-zinc-100">
        <div className="w-full flex items-center justify-between rounded-t-lg p-3 bg-zinc-200 backdrop-blur text-lg text-zinc-700 font-semibold shadow-zinc-700">
          Copilot
          {receiveData && (
            <div className="ml-4 text-sm flex items-center">
              <span className="mr-2 bg-green-500 h-4 w-4 rounded-full animate-pulse r" />
              Received Image From User
            </div>
          )}
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

"use client";

import { useMemo } from "react";
import type { ClientMessage } from "@/lib/types";

import { Separator } from "@/components/ui/separator";
import { EmptyScreen } from "@/components/internals/empty-screen";

interface InterviewerPanelProps {
  messages: ClientMessage[];
}

export function InterviewerPanel({ messages }: InterviewerPanelProps) {
  const interviewerMessagesOnly = useMemo(() => {
    return messages.filter((m) => m.role == "user");
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col p-4 relative w-full h-full">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-yellow-900">
        <div className="w-full rounded-t-lg p-3 bg-yellow-900 text-lg text-white font-semibold">
          Interviewer
        </div>

        <div className="h-full w-full flex flex-col relative">
          <div className="flex-1 mt-8 overflow-hidden">
            <div className="h-full overflow-y-auto w-full">
              {interviewerMessagesOnly.length ? (
                <div className="flex flex-col pb-9 text-sm">
                  {interviewerMessagesOnly.map(
                    (m: ClientMessage, index: number) => (
                      <div key={m.id}>
                        {m.display}

                        {index < interviewerMessagesOnly.length - 1 && (
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

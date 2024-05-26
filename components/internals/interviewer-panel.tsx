"use client";

import { useMemo } from "react";
import type { ClientMessage } from "@/lib/types";

import { Separator } from "@/components/ui/separator";
import { EmptyScreen } from "@/components/internals/empty-screen";
import { UserMessage } from "@/components/internals/chat-message";

interface InterviewerPanelProps {
  messages: ClientMessage[];
}

export function InterviewerPanel({ messages }: InterviewerPanelProps) {
  const interviewerMessagesOnly = useMemo(() => {
    return messages.filter((m) => m.role == "user");
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative w-full h-full">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-zinc-100">
        <div className="w-full rounded-t-lg p-3 bg-zinc-200 backdrop-blur text-lg text-zinc-700 font-semibold shadow-zinc-700">
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
                        <UserMessage>{m.value}</UserMessage>

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

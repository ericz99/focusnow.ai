"use client";

import { useEffect, useRef, useCallback } from "react";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { useDataStore } from "@/lib/stores";
import type { ClientMessage } from "@/lib/types";
import { useScrollToBottom } from "@/lib/hooks";
import { UserMessage } from "@/components/internals/chat-message";
import { Separator } from "@/components/ui/separator";
import { EmptyScreen } from "@/components/internals/empty-screen";
import { CopilotPanel } from "@/components/internals/copilot-panel";
import { InterviewerPanel } from "@/components/internals/interviewer-panel";

export function ChatPanel() {
  const $scrollToBottomRef = useRef<HTMLDivElement>(null);
  const [_isBottom, setBottomRef] = useScrollToBottom(false);
  const { incomingData, releaseData } = useDataStore();
  const { generateAnswer } = useActions();
  const [messages, setMessages] = useUIState();

  useEffect(() => {
    if ($scrollToBottomRef.current) {
      $scrollToBottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const checkIfQuestion = useCallback(
    async (text: string) => {
      if (text.endsWith("?")) {
        console.log("is a question!");

        const resp = await generateAnswer({
          question: text,
        });

        setMessages((cur: ClientMessage[]) => [...cur, resp]);
      }
    },
    [generateAnswer, setMessages]
  );

  useEffect(() => {
    if (incomingData && incomingData.length) {
      console.log("incoming data???");

      const getTranscription = async () => {
        try {
          const data = await fetch("/api/ai/transcribe", {
            // signal: abortController.signal,
            method: "POST",
            body: JSON.stringify({
              audioData: incomingData.at(-1),
            }),
          });

          const { transcription } = (await data.json()) as {
            transcription: string;
          };

          console.log("transcription", transcription);

          setMessages((cur: ClientMessage[]) => [
            ...cur,
            {
              id: nanoid(),
              role: "user",
              display: <UserMessage>{transcription}</UserMessage>,
            },
          ]);

          await checkIfQuestion(transcription);
        } catch (error) {
          console.error("Error fetching transcription:", error);
        }
      };

      getTranscription();
      releaseData();
    }

    // return () => abortController.abort();
  }, [incomingData, setMessages, messages, releaseData, checkIfQuestion]);

  return (
    <div className="container mx-auto max-w-8xl p-4 relative h-full w-full flex">
      {/* <div className="h-full w-full flex flex-col border border-solid border-zinc-300 relative">
        <div className="flex-1 mt-8 overflow-hidden">
          <div className="h-full overflow-y-auto w-full">
            {messages.length ? (
              <div className="flex flex-col pb-9 text-sm">
                {messages.map((m: ClientMessage, index: number) => (
                  <div key={m.id}>
                    {m.display}

                    {index < messages.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyScreen />
            )}

            <div ref={$scrollToBottomRef} />
            <div ref={setBottomRef} />
            <div className="w-full h-2 flex-shrink-0" />
          </div>
        </div>
      </div> */}

      <InterviewerPanel messages={messages} />
      <CopilotPanel messages={messages} />
    </div>
  );
}

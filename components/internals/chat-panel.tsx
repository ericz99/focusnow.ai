"use client";

import { useEffect, useRef, useCallback } from "react";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { useDataStore } from "@/lib/stores";
import type { ClientMessage } from "@/lib/types";
import { useScrollToBottom } from "@/lib/hooks";
import { UserMessage } from "@/components/internals/chat-message";
import { CopilotPanel } from "@/components/internals/copilot-panel";
import { InterviewerPanel } from "@/components/internals/interviewer-panel";

export function ChatPanel() {
  const $scrollToBottomRef = useRef<HTMLDivElement>(null);
  const [_isBottom, setBottomRef] = useScrollToBottom(false);
  const { incomingData, releaseData } = useDataStore();
  const { generateResponse } = useActions();
  const [messages, setMessages] = useUIState();

  useEffect(() => {
    if ($scrollToBottomRef.current) {
      $scrollToBottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  useEffect(() => {
    if (incomingData && incomingData.length) {
      console.log("incoming data???");
      console.log(incomingData);

      const getTranscription = async () => {
        try {
          const formData = new FormData();
          formData.append("audioData", incomingData.at(-1)!);

          const data = await fetch("/api/ai/transcribe", {
            // signal: abortController.signal,
            method: "POST",
            body: formData,
          });

          const { transcription } = (await data.json()) as {
            transcription: string;
          };

          console.log("transcription", transcription);

          if (transcription !== "") {
            const cloned = [...messages];
            const userMessage = cloned.find(
              (d: ClientMessage) => d.role == "user"
            ) as ClientMessage;

            const data = {
              id: nanoid(),
              role: "user",
              value: transcription,
              display: <UserMessage>{transcription}</UserMessage>,
            };

            if (!userMessage) {
              // # add initial message
              setMessages((cur: ClientMessage[]) => [...cur, data]);
            } else {
              // # update user message
              userMessage.value += transcription + " ";

              // # update messages
              setMessages((cur: ClientMessage[]) => [
                userMessage,
                ...cur.filter((c) => c.role == "assistant"),
              ]);
            }

            // setMessages((cur: ClientMessage[]) => [
            //   ...cur,
            //   {
            // id: nanoid(),
            // role: "user",
            // display: <UserMessage>{transcription}</UserMessage>,
            //   },
            // ]);

            /**
             *
             * no need to check if tis a question ,instead just keep answering question but do no repeat answer if
             * the AI already have responded with that previous question
             *
             * also, the AI should only say what  they feel about the context of the transcription, so
             * it does not have to be a question format, instead just based on the context of the transcription
             *
             */
            const resp = await generateResponse({
              prompt: data.value,
            });

            setMessages((cur: ClientMessage[]) => [...cur, resp]);
          }
        } catch (error) {
          console.error("Error fetching transcription:", error);
        }
      };

      getTranscription();
      releaseData();
    }

    // return () => abortController.abort();
  }, [incomingData, setMessages, messages, releaseData]);

  return (
    <div className="container mx-auto max-w-8xl p-4 relative h-full w-full flex">
      <InterviewerPanel messages={messages} />
      <CopilotPanel messages={messages} />
    </div>
  );
}

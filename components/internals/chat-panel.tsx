"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { useDataStore } from "@/lib/stores";
import type { ClientMessage } from "@/lib/types";
import { useScrollToBottom } from "@/lib/hooks";
import { UserMessage } from "@/components/internals/chat-message";
import { CopilotPanel } from "@/components/internals/copilot-panel";
import { InterviewerPanel } from "@/components/internals/interviewer-panel";
import { pusherClient } from "@/server/pusher";

interface ChatPanelProps {
  id: string;
}

export function ChatPanel({ id }: ChatPanelProps) {
  const $scrollToBottomRef = useRef<HTMLDivElement>(null);
  const { incomingData, releaseData } = useDataStore();
  const { generateResponse, solveCodeSnippet } = useActions();
  const [messages, setMessages] = useUIState();
  const [receiveData, setReceiveData] = useState(false);

  const convertImageToB64 = useCallback(async (url: string) => {
    // Fetch the image from the URL
    const response = await fetch(url);

    // Check if the response is ok
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Convert the response to a blob
    const blob = await response.blob();

    // Create a FileReader to read the blob as base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Get the base64 string
        const base64String = reader.result as string;
        // Remove the data URL prefix
        // # openai this library doesn't  seem to accept URL, and needs this format
        const base64WithoutPrefix = base64String.split(",")[1];
        resolve(base64WithoutPrefix);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  useEffect(() => {
    pusherClient.subscribe(`sess_${id}`);

    pusherClient.bind("incoming-data", async (url: string) => {
      setReceiveData(true);

      const resp = await convertImageToB64(url);

      const data = await solveCodeSnippet({
        data: resp,
      });

      console.log("called???");

      setMessages((cur: ClientMessage[]) => [...cur, data]);
      setReceiveData(false);
    });

    return () => {
      pusherClient.unbind("incoming-data");
      pusherClient.unsubscribe(`sess_${id}`);
    };
  }, [setMessages]);

  useEffect(() => {
    if ($scrollToBottomRef.current) {
      $scrollToBottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  useEffect(() => {
    // const abortController = new AbortController();

    if (incomingData && incomingData.length) {
      console.log("incoming data???");
      console.log(incomingData);

      const getTranscription = async () => {
        try {
          const formData = new FormData();
          formData.append("audioData", incomingData.at(-1)!);

          console.log("running transcription function");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingData, setMessages, messages, releaseData]);

  return (
    <div className="max-w-full p-8 relative h-full w-full flex gap-4">
      <InterviewerPanel messages={messages} />
      <CopilotPanel messages={messages} receiveData={receiveData} />
    </div>
  );
}

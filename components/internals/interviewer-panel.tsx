"use client";

import { useEffect, useState, useCallback } from "react";

import { useDataStore, useCopilotStore } from "@/lib/stores";

export function InterviewerPanel() {
  const { addQuestion } = useCopilotStore();
  const { incomingData, releaseData } = useDataStore();
  const [messages, setMessages] = useState<string[]>([]);

  const checkIfQuestion = useCallback(
    (text: string) => {
      const regex = /\?$/;

      if (regex.test(text)) {
        console.log("is a question!");
        addQuestion(text);
      }
    },
    [addQuestion]
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (incomingData && incomingData.length) {
      const getTranscription = async () => {
        const data = await fetch("/api/ai/transcribe", {
          signal: abortController.signal,
          method: "POST",
          body: JSON.stringify({
            audioData: incomingData.at(-1),
          }),
        });

        const { transcription } = (await data.json()) as {
          transcription: string;
        };
        console.log("transcription", transcription);
        setMessages([...messages, transcription]);
        releaseData();
        checkIfQuestion(transcription);
      };

      getTranscription();
    }

    return () => abortController.abort();
  }, [incomingData, setMessages, messages, releaseData, checkIfQuestion]);

  return (
    <div className="w-[400px] h-full relative flex overflow-hidden">
      <div className="w-full h-full rounded-lg  py-8 px-4">
        <div className="w-full rounded-t-lg p-3 bg-zinc-900 text-lg text-white font-semibold">
          Interviewer
        </div>

        <div className="flex flex-col gap-4 relative h-full overflow-scroll p-4 border-b-2 border-x-2 border-solid">
          <div className="flex flex-col gap-4 relative pb-9 h-full">
            {messages.length && messages.map((m, idx) => <p key={idx}>{m}</p>)}
          </div>

          <div className="flex-1 w-full h-10" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

import { useDataStore } from "@/lib/stores";

export function InterviewerPanel() {
  const { incomingData, releaseData } = useDataStore();
  const [messages, setMessages] = useState<string[]>([]);

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
      };

      getTranscription();
    }

    return () => abortController.abort();
  }, [incomingData, setMessages, messages, releaseData]);

  return (
    <div className="w-[400px] h-full p-4 relative flex overflow-hidden">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-zinc-900">
        <div className="w-full rounded-t-lg p-3 bg-zinc-900 text-lg text-white font-semibold">
          Interviewer
        </div>

        <div className="flex flex-col gap-4 relative mt-4 h-full overflow-scroll p-4">
          <div className="flex flex-col gap-4 relative pb-9 h-full">
            {messages.length && messages.map((m, idx) => <p key={idx}>{m}</p>)}
          </div>

          <div className="flex-1 w-full h-10" />
        </div>
      </div>
    </div>
  );
}

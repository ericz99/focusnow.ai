"use client";

import { useEffect } from "react";

import { useDataStore } from "@/lib/stores";

export function InterviewerPanel() {
  const { incomingData } = useDataStore();

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

        const json = await data.json();
        console.log("json", json);
      };

      getTranscription();

      return () => {
        abortController.abort();
      };
    }
  }, [incomingData]);

  return (
    <div className="w-[400px] h-full p-4 relative flex">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-zinc-900">
        <div className="w-full rounded-t-lg p-3 bg-zinc-900 text-lg text-white font-semibold">
          Interviewer
        </div>
      </div>
    </div>
  );
}

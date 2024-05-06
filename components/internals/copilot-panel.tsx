"use client";

import { useEffect, useState } from "react";

import { useCopilotStore } from "@/lib/stores";

export function CopilotPanel() {
  const { questions, removeQuestion } = useCopilotStore();
  const [resp, setResp] = useState<string[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    if (questions && questions.length) {
      const getAnswer = async () => {
        const data = await fetch("/api/ai/chat", {
          signal: abortController.signal,
          method: "POST",
          body: JSON.stringify({
            prompt: questions.at(-1),
          }),
        });

        const { transcription } = (await data.json()) as {
          transcription: string;
        };
        console.log("transcription", transcription);
        setResp([...resp, transcription]);
        removeQuestion();
      };

      getAnswer();
    }

    return () => abortController.abort();
  }, [questions, removeQuestion, resp]);

  return (
    <div className="flex-1 flex flex-col p-4 relative w-full h-full">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-orange-900">
        <div className="w-full rounded-t-lg p-3 bg-orange-900 text-lg text-white font-semibold">
          Copilot
        </div>
      </div>
    </div>
  );
}

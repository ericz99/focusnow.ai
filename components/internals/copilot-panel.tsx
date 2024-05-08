"use client";

import { useEffect } from "react";
import { useActions, useUIState } from "ai/rsc";
import { useCopilotStore } from "@/lib/stores";
import { nanoid } from "nanoid";
import type { ClientMessage } from "@/lib/types";

export function CopilotPanel() {
  const { questions, removeQuestion } = useCopilotStore();
  const { generateAnswer } = useActions();
  const [messages, setMessages] = useUIState();

  useEffect(() => {
    if (questions && questions.length) {
      const getAnswer = async () => {
        setMessages((cur: ClientMessage[]) => [
          ...cur,
          { id: nanoid(), role: "user", display: questions.at(-1) },
        ]);

        const resp = await generateAnswer(questions.at(-1));
        setMessages((cur: ClientMessage[]) => [...cur, resp]);
        removeQuestion();
      };

      getAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  return (
    <div className="flex-1 flex flex-col p-4 relative w-full h-full">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-orange-900">
        <div className="w-full rounded-t-lg p-3 bg-orange-900 text-lg text-white font-semibold">
          Copilot
        </div>

        <div className="flex flex-col gap-4 relative mt-4 h-full overflow-scroll p-4">
          <div className="flex flex-col gap-4 relative pb-9 h-full">
            {messages.map(
              (message: ClientMessage) =>
                message.role == "assistant" && (
                  <li key={message.id}>{message.display}</li>
                )
            )}
          </div>

          <div className="flex-1 w-full h-10" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { CircleCheck, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/stores";
import { SessionControl } from "@/components/internals/session-control";
import { ChatPanel } from "@/components/internals/chat-panel";
import { SessionItemIncluded } from "@/prisma/db/session";
import { usePersistentTimer } from "@/lib/hooks";
import { formatTime } from "@/lib/utils";

const MediaRecorder = dynamic(
  () =>
    import("@/lib/hooks/use-media-recorder").then(
      (mod) => mod.ReactMediaRecorder
    ),
  { ssr: false }
);

interface CopilotSessionLayoutProps {
  session: SessionItemIncluded;
}

export default function CopilotSessionLayout({
  session,
}: CopilotSessionLayoutProps) {
  const { setChromeAudioActive, isChromeAudioActive } = useSessionStore();
  const [next, setNext] = useState(false);

  const { remainingTime, startTimer } = usePersistentTimer(next, {
    onTick: () => {
      console.log("Tick");
    },
    onComplete: () => {
      console.log("Completed");
    },
  });

  return (
    <MediaRecorder
      render={({ configureStream, startStream, stopStream }) =>
        !isChromeAudioActive || !next ? (
          <div className="h-full w-full gap-8 relative flex flex-col justify-center items-center">
            {!isChromeAudioActive ? (
              <CircleAlert size={48} color="red" />
            ) : (
              <CircleCheck size={48} color="green" />
            )}

            <h1 className="text-lg font-base max-w-sm line-clamp-4 text-center">
              You successully created a new session for the copilot. Please
              configure your chrome audio sources before proceeding!
            </h1>

            {!isChromeAudioActive ? (
              <div className="italic text-sm text-red-400 flex items-center gap-2">
                <CircleAlert size={18} color="red" />
                1. Please select a chrome audio tab below!
              </div>
            ) : (
              <div className="line-through italic text-sm text-green-400 flex items-center gap-2">
                <CircleCheck size={18} color="green" />
                1. Successfully setup chrome audio tab!
              </div>
            )}

            <Button
              variant={"success"}
              size={"lg"}
              disabled={!isChromeAudioActive}
              onClick={() => {
                startTimer(60 * 10 * 1000);
                setNext(true);
              }}
            >
              Continue
            </Button>

            <div className="p-4 flex flex-col gap-4 border-2 border-solid border-zinc-200 rounded-lg max-w-sm w-full">
              <p className="text-lg">Select Chrome Audio</p>

              <Button
                variant={"success"}
                size={"lg"}
                onClick={async () => {
                  const success = await configureStream();
                  if (success) setChromeAudioActive(true);
                }}
              >
                Configure
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full max-w-full flex-1 relative">
            <div className="flex items-center relative justify-between p-4">
              <div className="flex-1 gap-4">
                <h1 className="font-semibold text-3xl">{session?.name}</h1>
                <p>
                  Session Remaining:{" "}
                  <strong>
                    {remainingTime ? formatTime(remainingTime) : "Unknown"}
                  </strong>
                </p>
              </div>

              <SessionControl
                startStream={startStream}
                stopStream={stopStream}
              />
            </div>

            <div className="flex h-full w-full overflow-hidden gap-4">
              <ChatPanel />
            </div>
          </div>
        )
      }
    />
  );
}

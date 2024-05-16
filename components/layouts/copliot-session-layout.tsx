"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CircleCheck, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/stores";
import { SessionControl } from "@/components/internals/session-control";
import { ChatPanel } from "@/components/internals/chat-panel";

const MediaRecorder = dynamic(
  () =>
    import("@/lib/hooks/use-media-recorder").then(
      (mod) => mod.ReactMediaRecorder
    ),
  { ssr: false }
);

export default function CopilotSessionLayout() {
  const { setChromeAudioActive, isChromeAudioActive } = useSessionStore();
  const [next, setNext] = useState(false);

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
              onClick={() => setNext(true)}
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
            <SessionControl startStream={startStream} stopStream={stopStream} />

            <div className="flex h-full w-full overflow-hidden gap-4">
              <ChatPanel />
            </div>
          </div>
        )
      }
    />
  );
}

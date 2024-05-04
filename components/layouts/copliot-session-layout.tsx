"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/stores";
import { InterviewerPanel } from "@/components/internals/interviewer-panel";
import { CopilotPanel } from "@/components/internals/copilot-panel";
import { SessionControl } from "@/components/internals/session-control";

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
            <CircleCheck size={48} color="green" />

            <h1 className="text-lg font-semibold max-w-sm line-clamp-4 text-center">
              You successully created a new session for the copilot. Please
              configure your chrome audio sources before proceeding!
            </h1>

            <Button
              variant={"default"}
              size={"lg"}
              disabled={!isChromeAudioActive}
              onClick={() => setNext(true)}
            >
              Continue
            </Button>

            <div className="p-4 flex flex-col gap-4 border-2 border-solid border-zinc-600 rounded-lg max-w-sm w-full">
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

            <div className="flex h-full w-full overflow-hidden">
              <InterviewerPanel />
              <CopilotPanel />
            </div>
          </div>
        )
      }
    />
  );
}

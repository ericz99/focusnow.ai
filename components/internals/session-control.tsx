"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

interface SessionControlProps {
  startStream: () => Promise<void>;
  stopStream: () => void;
}

export function SessionControl({
  startStream,
  stopStream,
}: SessionControlProps) {
  const [isRunning, setRunning] = useState(false);

  return (
    <div className="p-4 relative flex justify-end gap-4">
      <Button
        variant={"success"}
        onClick={async () => {
          setRunning(true);
          await startStream();
        }}
        disabled={isRunning}
      >
        Start
      </Button>
      <Button
        variant={"destructive"}
        onClick={() => {
          setRunning(false);
          stopStream();
        }}
        disabled={!isRunning}
      >
        Stop
      </Button>
      <Button variant={"default"}>End Session</Button>
    </div>
  );
}

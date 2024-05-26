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
    <div className="relative flex justify-end gap-4">
      <Button
        variant={"outline"}
        onClick={async () => {
          setRunning(true);
          await startStream();
        }}
        className="border-solid"
        disabled={isRunning}
      >
        Start
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          setRunning(false);
          stopStream();
        }}
        className="border-solid"
        disabled={!isRunning}
      >
        Stop
      </Button>
      <Button variant={"default"}>End Session</Button>
    </div>
  );
}

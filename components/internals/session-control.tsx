"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { formatTime } from "@/lib/utils";

interface SessionControlProps {
  id: string;
  startStream: () => Promise<void>;
  stopStream: () => void;
  remainingTime: number;
  updateSessionData: (data: {
    id: string;
    startTime?: string;
    endTime?: string;
    isFinished?: boolean;
  }) => Promise<void>;
}

export function SessionControl({
  id,
  startStream,
  stopStream,
  remainingTime,
  updateSessionData,
}: SessionControlProps) {
  const router = useRouter();
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"default"}>End Session</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex gap-4 justify-between mb-8">
                End Session
                <h1 className="text-5xl font-bold">
                  {formatTime(remainingTime)}
                </h1>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to end your session early. Please note that you will
              not be able to resume the session. Are you sure you want to
              proceed?{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                // # update session to finished
                await updateSessionData({
                  id,
                  isFinished: true,
                });

                // # redirect user back to /app/intervier
                router.push("/app/interview");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

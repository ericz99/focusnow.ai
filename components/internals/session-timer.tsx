"use client";

import React from "react";
import { usePersistentTimer } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils";

interface SessionTimerProps {
  id: string;
  endTime: string;
  updateSessionData: (data: {
    id: string;
    startTime?: string;
    endTime?: string;
    isFinished?: boolean;
  }) => Promise<void>;
}

export function SessionTimer({
  id,
  endTime,
  updateSessionData,
}: SessionTimerProps) {
  const { remainingTime } = usePersistentTimer(true, {
    onTick: () => {
      console.log("Tick");
    },
    onComplete: async () => {
      console.log("Completed");

      // # update session to finished
      await updateSessionData({
        id: id,
        isFinished: true,
      });
    },
    prevEndTime: endTime,
  });

  return <Badge>Session Remaining: {formatTime(remainingTime!)}</Badge>;
}

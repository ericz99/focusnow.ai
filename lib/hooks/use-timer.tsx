"use client";

import { useState, useEffect, useRef } from "react";

interface CountdownOptions {
  interval?: number;
  onTick?: () => void;
  onComplete?: () => void;
  prevEndTime?: string | null;
}

function getRemainingTime(endTime: number): number {
  const now = new Date().getTime();
  return Math.max(endTime - now, 0);
}

export function usePersistentTimer(
  isActive: boolean,
  { interval = 1000, onTick, onComplete, prevEndTime }: CountdownOptions
) {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [_, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (prevEndTime) {
      setEndTime(Number(prevEndTime));
      setRemainingTime(getRemainingTime(Number(prevEndTime)));
    }
  }, [prevEndTime]);

  useEffect(() => {
    if (isActive && endTime !== null) {
      const tick = () => {
        const newRemainingTime = getRemainingTime(endTime);
        setRemainingTime(newRemainingTime);

        if (onTick) onTick();

        if (newRemainingTime <= 0) {
          clearInterval(timerIdRef.current!);
          if (onComplete) onComplete();
        }
      };

      timerIdRef.current = setInterval(tick, interval);
      return () => {
        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
        }
      };
    }
  }, [isActive, endTime, interval, onTick, onComplete, prevEndTime]);

  const startTimer = (duration: number) => {
    let startTime = null;
    let endTime = null;

    if (!prevEndTime) {
      startTime = new Date().getTime();
      setStartTime(startTime);
      endTime = startTime + duration;
      setEndTime(endTime);
      setRemainingTime(getRemainingTime(endTime));
    } else {
      endTime = Number(prevEndTime);
      setRemainingTime(getRemainingTime(Number(prevEndTime)));
    }

    return {
      startTime: String(startTime),
      endTime: String(endTime),
    };
  };

  return { remainingTime, startTimer };
}

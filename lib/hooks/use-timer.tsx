"use client";

import { useState, useEffect, useRef } from "react";

interface CountdownOptions {
  interval?: number;
  onTick?: () => void;
  onComplete?: () => void;
}

function getRemainingTime(endTime: number): number {
  const now = new Date().getTime();
  return Math.max(endTime - now, 0);
}

export function usePersistentTimer(
  isActive: boolean,
  { interval = 1000, onTick, onComplete }: CountdownOptions
) {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedEndTime = localStorage.getItem("countdownEndTime");
    if (savedEndTime) {
      const parsedEndTime = parseInt(savedEndTime, 10);
      setEndTime(parsedEndTime);
      setRemainingTime(getRemainingTime(parsedEndTime));
    }
  }, []);

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
  }, [isActive, endTime, interval, onTick, onComplete]);

  const startTimer = (duration: number) => {
    const currentEndTime = new Date().getTime() + duration;
    setEndTime(currentEndTime);
    localStorage.setItem("countdownEndTime", currentEndTime.toString());
    setRemainingTime(getRemainingTime(currentEndTime));
  };

  return { remainingTime, startTimer };
}

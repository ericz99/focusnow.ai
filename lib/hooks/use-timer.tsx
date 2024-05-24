import { useState, useEffect } from "react";

interface UsePersistentTimerProps {
  duration: number; // Duration in minutes
  startTime: number; // Pre-fetched start time in milliseconds
  onComplete: () => void;
}

export const usePersistentTimer = ({
  duration,
  startTime,
  onComplete,
}: UsePersistentTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const endTime = startTime + duration * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remainingTime = Math.max(0, endTime - now);
      setTimeLeft(Math.floor(remainingTime / 1000));

      if (remainingTime <= 0) {
        onComplete();
      }
    };

    const intervalId = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(intervalId);
  }, [duration, startTime, onComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return formatTime(timeLeft);
};

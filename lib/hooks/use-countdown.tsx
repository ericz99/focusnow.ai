import { useState, useEffect, useRef } from "react";

interface CountdownOptions {
  interval?: number;
  onTick?: () => void;
  onComplete?: () => void;
}

export function useCountdown(
  start: boolean,
  endTime: number,
  { interval = 1000, onTick, onComplete }: CountdownOptions
) {
  const [timeLeft, setTimeLeft] = useState<number>(endTime);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (start && timeLeft > 0) {
      timerIdRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - interval;
          if (newTime <= 0) {
            clearInterval(timerIdRef.current!);
            onComplete && onComplete();
            return 0;
          }
          onTick && onTick();
          return newTime;
        });
      }, interval);

      return () => clearInterval(timerIdRef.current!);
    } else {
      // Reset the time left when the countdown stops
      setTimeLeft(endTime);
    }
  }, [start, endTime, timeLeft, interval, onTick, onComplete]);

  return timeLeft;
}

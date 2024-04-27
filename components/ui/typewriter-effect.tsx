"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export interface IRedoAnimTextProps {
  delay: number;
  messages: string[];
}

const cursorVariants = {
  blinking: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatDelay: 0,
      ease: "linear",
      times: [0, 0.5, 0.5, 1],
    },
  },
};

function CursorBlinker() {
  return (
    <motion.div
      variants={cursorVariants}
      animate="blinking"
      className="inline-block h-7 lg:h-16 w-[3px] translate-y-1 translate-x-2 bg-orange-500"
    />
  );
}

function RedoAnimText({ delay, messages }: IRedoAnimTextProps) {
  const textIndex = useMotionValue(0);

  const baseText = useTransform(textIndex, (latest) => messages[latest] || "");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    baseText.get().slice(0, latest)
  );
  const updatedThisRound = useMotionValue(true);

  useEffect(() => {
    animate(count, 60, {
      type: "tween",
      delay: delay,
      duration: 1,
      ease: "easeIn",
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 1,
      onUpdate(latest) {
        if (updatedThisRound.get() === true && latest > 0) {
          updatedThisRound.set(false);
        } else if (updatedThisRound.get() === false && latest === 0) {
          if (textIndex.get() === messages.length - 1) {
            textIndex.set(0);
          } else {
            textIndex.set(textIndex.get() + 1);
          }
          updatedThisRound.set(true);
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.span className="text-4xl lg:text-7xl relative whitespace-nowrap text-orange-500">
      {displayText}
    </motion.span>
  );
}

export interface IAnimTextProps {
  delay: number;
  messages: string[];
}

export default function AnimText({ delay, messages }: IAnimTextProps) {
  const baseText = "Dear Hiring Manager, ";
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, baseText.length, {
      type: "tween",
      delay: delay,
      duration: 1,
      ease: "easeInOut",
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="space-y-4 lg:space-y-2">
      <RedoAnimText delay={delay + 1} messages={messages} />
      <CursorBlinker />
    </span>
  );
}

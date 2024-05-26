import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { ChevronDown } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

const features = [
  {
    Icon: FileTextIcon,
    name: "AI Interview Copilot",
    description: "Allow our AI Copilot to assist your interview.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Real-Time Transcription",
    description: "Get near real-time response from our AI Copilot.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "AI Coding Support",
    description: "Easy AI Coding Support that will help you step by step.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Replay System",
    description: "Able to replay your interview and study them.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "AI Auto Feedback",
    description: "Get real feedback on how you performed on your interviews.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export async function Features() {
  return (
    <div className="mx-auto max-w-5xl mt-16 px-4 sm:px-6 lg:px-8 pb-32 text-center relative">
      <div className="flex flex-col justify-center items-center gap-4 mb-12">
        <AnimatedButton classNames="flex flex-col items-center mb-12">
          <span className="mt-3 inline-block whitespace-nowrap rounded-full bg-neutral-800 p-4 text-1xl font-semibold uppercase leading-5 tracking-wide text-white">
            Features
          </span>

          <ChevronDown className="mt-4" size={24} />
        </AnimatedButton>
      </div>

      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}

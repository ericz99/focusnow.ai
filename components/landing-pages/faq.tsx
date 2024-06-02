/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faq = [
  {
    question: "What is the system requirement to run Interview Pilot Web App?",
    answer:
      "All you need is Google Chrome Browser, and make sure its on the latest update to prevent disruption.",
  },
  {
    question: "Which online meeting platform are supported?",
    answer:
      "We support major platform that has access to the web browser, eg: Zoom, Google Meet, Teams, WebEX, and more...",
  },
  {
    question: "Are there free trial?",
    answer:
      "Yes, we offer free plan with $25 credit which can allow you to try out our software to see if its a good fit for you. These credit are not refundable, and can only run 1 times with limited amount of duration.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Our policy does not permit / offer refunds. Any unused credits will not expire, please note to cancel an subscription, you must do it in the dashboard, and you will not be charged if cancelled. Please visit our terms and conditions below.",
  },
  {
    question: "Is there any transcription for previous interview session?",
    answer:
      "We provide data protection standards, Interview Copilot does not retain any interview transcriptions, but however user have the option to download interview report for each session. User should know that download option will only happen after the session ends, and if page refresh you will not be able to download transcription for the previous session.",
  },
  {
    question: "Does this support mobile device?",
    answer:
      "No, this software does not support mobile device, only desktop browser are supported.",
  },
];

export function FAQ() {
  return (
    <div className="w-full mx-auto max-w-5xl p-8 relative lg:my-12">
      <div className="mx-auto max-w-5xl text-center mb-8">
        <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
          FAQs
        </h4>
        <h2 className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
          Need help with something? Here are some of the most common questions
          we get.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faq.map((f, i) => (
          <AccordionItem key={i} value={`item_${i}`}>
            <AccordionTrigger>{f.question}</AccordionTrigger>
            <AccordionContent>{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

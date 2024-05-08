import { openai } from "@ai-sdk/openai";
import {
  createAI,
  getMutableAIState,
  streamUI,
  createStreamableValue,
} from "ai/rsc";
import { nanoid } from "nanoid";
import type { AIState, UIState } from "@/lib/types";

import {
  SpinnerMessage,
  BotMessage,
} from "@/components/internals/chat-message";

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    generateAnswer,
  },
  onSetAIState: async ({ key, state, done }) => {
    "use server";

    console.log("state", state);
  },
});

async function generateAnswer(question: string) {
  "use server";

  const history = getMutableAIState<typeof AI>();

  history.update([
    ...history.get(),
    {
      id: nanoid(),
      role: "user",
      content: question,
    },
  ]);

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    initial: <SpinnerMessage />,
    system: `

    {SYSTEM}: You are an AI interview copilot that will help me answer all question that is related to this behavioral interview. \n

    You are an experienced developer that is going through a behavioral interview. \n

    For each questions please come up with multiple short plain and simple answers that can be answer to that question. \n

    Please return each unique answers in a bullet point form, and only generate up to 10 answers. \n

    `,
    messages: [
      ...history.get().map((m: any) => ({
        role: m.role,
        content: m.content,
        name: m.name,
      })),
    ],
    temperature: 0.8,
    maxTokens: 500,
    text: ({ content, delta, done }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        history.done([
          ...history.get(),
          {
            id: nanoid(),
            role: "assistant",
            content,
          },
        ]);
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

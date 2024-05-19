import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
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
import { checkAuth } from "@/lib/auth";
import { getClient } from "@/core/db/lance";

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: {
    messages: [],
  } as AIState,
  initialUIState: [] as UIState,
  actions: {
    generateAnswer,
  },
  onSetAIState: async ({ key, state, done }) => {
    "use server";

    const user = await checkAuth();
    const { session, messages } = state;
    // # save all ai answer here
    console.log("messages", messages);
  },
});

async function generateAnswer({ question }: { question: string }) {
  "use server";

  const state = getMutableAIState<typeof AI>();
  const db = await getClient();
  const table = await db.openTable("doc-table");

  // # update history messages with initial prompt
  state.update({
    ...state.get(),
    messages: [
      ...state.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: question,
      },
    ],
  });

  // # create embedding then check for embedding
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-large"),
    value: question,
  });

  // # query embedding data
  const context = await table.search(embedding).execute();

  let allContentJointed = "";

  console.log("context", context);

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
      ...state.get().messages.map((m: any) => ({
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
        state.done({
          ...state.get(),
          messages: [
            ...state.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
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

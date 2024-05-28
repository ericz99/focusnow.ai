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
import { checkAuth } from "@/lib/auth";
import { updateSession } from "@/prisma/db/session";
import { revalidatePath } from "next/cache";

export const updateSessionTime = async (data: {
  id: string;
  startTime: string;
  endTime: string;
}) => {
  "use server";

  await updateSession(data);

  revalidatePath("/app/session/[sessionId]", "page");
};

export const updateSessionData = async (data: {
  id: string;
  isFinished?: boolean;
  startTime?: string;
  endTime?: string;
}) => {
  "use server";

  await updateSession(data);

  revalidatePath("/app/session/[sessionId]", "page");
};

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: {
    messages: [],
  } as AIState,
  initialUIState: [] as UIState,
  actions: {
    generateResponse,
  },
  onSetAIState: async ({ key, state, done }) => {
    "use server";

    const user = await checkAuth();
    const { session, messages } = state;
    // # save all ai answer here
    console.log("messages", messages);
  },
});

async function generateResponse({ prompt }: { prompt: string }) {
  "use server";

  const state = getMutableAIState<typeof AI>();
  const { session } = state.get();

  if (!session) {
    throw new Error("Session not found!");
  }

  const { job, additionalInfo } = session;

  // # update history messages with initial prompt
  state.update({
    ...state.get(),
    messages: [
      ...state.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: prompt,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const initialContext = `
    You are applying for this job: \n
    Position: ${job?.position} \n
    Company: ${job?.company} \n
    Company Detail: ${job?.companyDetail} \n
    Job Description: ${job?.jobDescription} \n
    Additional Information about this interview: ${additionalInfo} \n
  `;

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    initial: <SpinnerMessage />,
    system: `

    <initial-system-prompt>: You are an AI interview copilot that will help me answer all question that is related to this behavioral / technical interview. Please use the {CONTEXT} below, if empty string, then ignore context. </initial-system-prompt> \n

    <context>: ${initialContext} </context> \n

    <main-goal> \n
    
    You are an experienced developer that is going through a behavioral / technical interview. \n

    For each questions please come up with multiple short plain and simple answers that can be answer to that question. \n

    Please return each unique answers in a bullet point form, and only generate up to 10 answers. \n

    If you already made a response, on the prompt avoid making additional response to save output token. \n

    </main-goal> \n

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
        textStream.done();
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
    value: result.value as string,
    display: result.value,
  };
}

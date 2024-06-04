import { openai } from "@ai-sdk/openai";
import { URL } from "node:url";
import {
  createAI,
  getMutableAIState,
  streamUI,
  createStreamableValue,
  getAIState,
} from "ai/rsc";
import { nanoid } from "nanoid";
import type {
  AIState,
  ClientMessage,
  ServerMessage,
  UIState,
} from "@/lib/types";

import {
  SpinnerMessage,
  BotMessage,
  UserMessage,
} from "@/components/internals/chat-message";
import { updateSession } from "@/prisma/db/session";
import { createTranscript } from "@/prisma/db/transcript";
import { revalidatePath } from "next/cache";
import { streamText } from "ai";
import { z } from "zod";

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
    solveCodeSnippet,
  },
  // onGetUIState: async () => {
  //   "use server";

  //   const aiState = getAIState();

  //   if (aiState) {
  //     return getUIStateFromAIState(aiState);
  //   }
  // },
  onSetAIState: async ({ state }) => {
    "use server";

    const { session, messages } = state;

    if (!session) {
      throw new Error("Session not found!");
    }

    console.log("messages", messages);

    // const { id } = session;

    // const lastMessage = messages.at(-1);

    // // # create the last message
    // await createTranscript({
    //   sessionId: id,
    //   role: lastMessage!.role!,
    //   content: lastMessage!.content! as string,
    //   id: lastMessage!.id,
    // });
  },
});

async function solveCodeSnippet({
  data,
  prompt,
}: {
  data: string;
  prompt?: string;
}) {
  "use server";

  const state = getMutableAIState<typeof AI>();

  const userMessage: ServerMessage = {
    id: nanoid(),
    role: "user",
    content: [
      {
        type: "text",
        text:
          prompt ??
          "Please help me solve this coding problem of the given image.",
      },
      {
        type: "image",
        image: data,
      },
    ],
  };

  // # update history messages with initial prompt
  state.update({
    ...state.get(),
    messages: [...state.get().messages, userMessage],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: openai("gpt-4o"),
    initial: <SpinnerMessage />,
    system: `

    <initial-system-prompt>: You are an AI interview copilot that will help me answer all question that is related to this behavioral / technical interview. Please use the {CONTEXT} below, if empty string, then ignore context. </initial-system-prompt> \n

    <main-goal> \n
    
    You are AI Coding Copilot that help me solve the coding problem of a given image. \n

    You must return the solution to the problem, as well as in depth walkthrough explaination of the solution, and step by step to solve the problem. \n

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
    maxTokens: 1000,
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

async function generateResponse({ prompt }: { prompt: string }) {
  "use server";

  const state = getMutableAIState<typeof AI>();
  const { session } = state.get();

  if (!session) {
    throw new Error("Session not found!");
  }

  const { job, additionalInfo } = session;

  const userMessage: ServerMessage = {
    id: nanoid(),
    role: "user",
    content: prompt,
  };

  // # update history messages with initial prompt
  state.update({
    ...state.get(),
    messages: [...state.get().messages, userMessage],
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
    model: openai("gpt-4o"),
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
    maxTokens: 1000,
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

export const getUIStateFromAIState = (aiState: AIState) => {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${message.id}`,
      role: message.role as ClientMessage["role"],
      value: message.content as string,
      display:
        message.role === "user" ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === "assistant" &&
          typeof message.content === "string" ? (
          <BotMessage content={message.content} />
        ) : null,
    }));
};

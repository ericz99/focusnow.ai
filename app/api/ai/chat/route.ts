import OpenAI from "openai";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse, NextRequest } from "next/server";

import { pinecone } from "@/core/db";
import { llmOpenAI } from "@/core/llm/openai";
import { getOnlyContentTokenLength, getTokenLength } from "@/lib/tokenizer";
import {
  createChatHistory,
  createChatRequest,
  getChatHistoryById,
  addRequestToHistory,
} from "@/prisma/db/chat";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const generateTitle = async (prompt: string) => {
  // # build a custom prompt builder?? todo
  const messages = [
    {
      role: "system",
      content: `
      
      Please generate a short title based on the following prompt: ${prompt} \n
      
      `,
    },
  ] as OpenAI.Chat.ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages,
    temperature: 0.7,
  });

  return response.choices[0];
};

export async function POST(req: NextRequest) {
  try {
    const { messages, ...rest } = await req.json();

    console.log("messages", messages);
    console.log("rests", rest);

    // # create embedding
    const embedResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: messages[0].content,
    });

    let embeddings = embedResponse.data.map((item: any) => {
      return item.embedding;
    });

    // # query pinecone
    const context = await pinecone.query({
      vector: embeddings,
      includeMetadata: true,
      topK: 5,
    });

    let allContentJoined = "";

    if (context?.matches) {
      allContentJoined = context.matches
        .map((c) => c!.metadata!.content)
        .join(" ");
    }

    // # append context above the user messages
    messages.unshift({
      role: "system",
      content: `
      Use the following context to answer future question that may help you. \n

      Context: ${allContentJoined}
      
      `,
    });

    console.log("messages_!", messages);

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      stream: true,
      messages,
      temperature: 0.7,
    });

    let completionToken = 0;
    let totalToken = 0;
    let promptToken = 0;

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      onStart: async () => {
        const tokenList = getOnlyContentTokenLength(
          messages,
          "gpt-3.5-turbo-0125"
        );

        promptToken = tokenList;
      },
      onToken: async (token: string) => {
        const tokenList = getTokenLength(token, "gpt-3.5-turbo-0125");
        completionToken += tokenList;
      },
      onCompletion: async (completion: string) => {
        // /**
        //  *
        //  * dont recreate title only if chat history exist
        //  * 1. query chat h istory
        //  * if no  chat history create with the request
        //  * otherwisse just create the request with the id of  the  chat history
        //  *
        //  */

        const history = await getChatHistoryById(rest.id);

        if (!history) {
          // # generate a new title for the chats using api
          const initialPrompt = messages.at(-1).content;
          const { message } = await generateTitle(initialPrompt);
          const { content } = message;
          // # create chat request
          const [user, assistant] = await Promise.all([
            createChatRequest({
              model: "gpt-3.5-turbo-0125",
              role: "user",
              content: initialPrompt,
            }),
            createChatRequest({
              usage: {
                completionToken,
                promptToken,
                totalToken,
              },
              model: "gpt-3.5-turbo-0125",
              role: "assistant",
              content: completion,
            }),
          ]);
          if (user && assistant) {
            // # create new chat history
            await createChatHistory({
              id: rest.id,
              name: content!,
              assistantId: rest.assistantId,
              request: [user.id, assistant.id],
            });
          } else {
            throw new Error("Missing chat request, please try again!");
          }
        } else {
          const initialPrompt = messages.at(-1).content;

          // # create chat request
          const [user, assistant] = await Promise.all([
            createChatRequest({
              model: "gpt-3.5-turbo-0125",
              role: "user",
              content: initialPrompt,
            }),
            createChatRequest({
              usage: {
                completionToken,
                promptToken,
                totalToken,
              },
              model: "gpt-3.5-turbo-0125",
              role: "assistant",
              content: completion,
            }),
          ]);

          if (user && assistant) {
            // # add request to chat history
            await addRequestToHistory(rest.id, [user.id, assistant.id]);
          } else {
            throw new Error("Missing chat request, please try again!");
          }
        }
      },
    });

    // # respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}

// todo: revalidatePath, once we create new chat, it should appear in the sidebar
// todo fix ui issue, where when I start a new conversation, it falls back to line 112, then the message reappear

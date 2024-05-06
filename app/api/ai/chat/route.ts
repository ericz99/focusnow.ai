import OpenAI from "openai";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse, NextRequest } from "next/server";

import { getOnlyContentTokenLength, getTokenLength } from "@/lib/tokenizer";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, ...rest } = await req.json();

    console.log("messages", messages);
    console.log("rests", rest);

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
      onCompletion: async (completion: string) => {},
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

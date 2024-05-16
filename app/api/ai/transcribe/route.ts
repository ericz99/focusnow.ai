import OpenAI, { toFile } from "openai";
import { Buffer } from "node:buffer";
import { NextResponse, NextRequest } from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as any;
    const base64Audio = body.audioData;
    const audioBuffer = Buffer.from(base64Audio, "base64");

    const resp = await openai.audio.transcriptions.create({
      file: await toFile(audioBuffer, "audio.wav", {
        //@ts-ignore
        contentType: "audio/wav",
      }),
      model: "whisper-1",
    });

    return NextResponse.json({
      transcription: resp.text,
    });
  } catch (error) {
    console.error("Error during transcription:", error);
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      console.log("error occured", error);
    }
  }
}

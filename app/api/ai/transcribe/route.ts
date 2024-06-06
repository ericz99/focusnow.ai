import OpenAI, { toFile } from "openai";
import { Buffer } from "node:buffer";
import { NextResponse, NextRequest } from "next/server";
import { DeepgramClient } from "@deepgram/sdk";
import deepgram from "@/server/deepgram";

let model: DeepgramClient | OpenAI | null = null;

if (process.env.ENABLED_AUDIO_AI == "deepgram") {
  model = deepgram;
}

if (process.env.ENABLED_AUDIO_AI == "openai") {
  model = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
  });
}

// Type guard for DeepgramClient
function isDeepgramClient(model: any): model is DeepgramClient {
  return model instanceof DeepgramClient;
}

// Type guard for OpenAI
function isOpenAI(model: any): model is OpenAI {
  return model instanceof OpenAI;
}

export const runtime =
  process.env.ENABLED_AUDIO_AI == "deepgram" ? "nodejs" : "edge";

export async function POST(req: NextRequest) {
  try {
    console.log("HELLO MAKING REQUEST!");

    const form = await req.formData();
    const audioData = form.get("audioData") as Blob;

    if (!audioData) {
      throw new Error("No audio data found in the request body");
    }

    if (model) {
      if (isOpenAI(model)) {
        console.log("using openai model");

        const resp = await model.audio.transcriptions.create({
          file: await toFile(audioData, "audio.wav", {
            //@ts-ignore
            contentType: "audio/wav",
          }),
          model: "whisper-1",
          prompt:
            "Please ignore the audio if it silence, and avoid making any transcription if there is no sound.",
        });

        console.log("resp", resp);

        return NextResponse.json({
          transcription: resp.text,
        });
      } else if (isDeepgramClient(model)) {
        console.log("using deepgram model");

        const audioBuffer = await audioData.arrayBuffer();
        const buffer = Buffer.from(audioBuffer);

        const { result, error } = await model.listen.prerecorded.transcribeFile(
          buffer,
          {
            model: "nova-2-general",
            punctuate: true,
            filler_words: true,
            utterances: true,
            smart_format: true,
            language: "en-US",
          }
        );

        if (error) {
          console.log(error);
          throw error;
        }

        return NextResponse.json({
          transcription: result.results.channels[0].alternatives[0].transcript,
        });
      } else {
        throw new Error("Invalid model type.");
      }
    }
  } catch (error) {
    console.error("Error during transcription:", error);
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      console.log("error occured", error);
      return NextResponse.json({ message: "error occured" }, { status: 500 });
    }
  }
}

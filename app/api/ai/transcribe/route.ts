import OpenAI, { toFile } from "openai";
import { Buffer } from "node:buffer";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@deepgram/sdk";

// // Create an OpenAI API client (that's edge friendly!)
// const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    console.log("HELLO MAKING REQUEST!");
    // const body = (await req.json()) as any;
    // const base64Audio = body.audioData;

    // if (!base64Audio) {
    //   throw new Error("No audio data found in the request body");
    // }

    const form = await req.formData();
    const audioData = form.get("audioData") as Blob;

    // const audioBuffer = Buffer.from(base64Audio, "base64");

    // console.log("audiobuffer", audioBuffer);

    // const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    //   audioBuffer,
    //   {
    //     model: "nova-2",
    //     punctuate: true,
    //     filler_words: true,
    //     utterances: true,
    //   }
    // );

    // if (error) {
    //   console.log(error);
    //   throw error;
    // }

    const resp = await openai.audio.transcriptions.create({
      file: await toFile(audioData, "audio.wav", {
        //@ts-ignore
        contentType: "audio/wav",
      }),
      model: "whisper-1",
    });

    return NextResponse.json({
      transcription: resp.text,
    });

    // return NextResponse.json({
    //   transcription: result.results.channels[0].alternatives[0].transcript,
    // });
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

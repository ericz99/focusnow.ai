import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { Blob, Buffer } from "node:buffer";
import { pusherServer } from "@/server/pusher";
import { utapi } from "@/server/uploadthing";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized request",
      },
      {
        status: 401,
      }
    );
  }

  const body = (await request.json()) as {
    data: string;
    currentSessionId: string;
  };

  const { data, currentSessionId } = body;

  const f = new File(
    [
      // @ts-ignore
      Uint8Array.from(atob(data.split(",")[1]!), (m) => m.codePointAt(0)),
    ],
    `coding-snippet_${currentSessionId}.png`,
    { type: "image/png" }
  );

  const { data: uploadData, error } = await utapi.uploadFiles(f);

  if (error) {
    throw new Error("Upload failed!");
  }

  const { url } = uploadData;

  // # send trigger to client
  pusherServer.trigger(`sess_${currentSessionId}`, "incoming-data", url);

  return new Response("ok", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export const OPTIONS = async (request: NextRequest) => {
  return new NextResponse("", {
    status: 200,
  });
};

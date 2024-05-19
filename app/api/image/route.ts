import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

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

  // todo
  const body = await request.json();
  console.log("body", body);

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

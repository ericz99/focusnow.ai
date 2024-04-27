import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";

import { getTeamAssistants, createAssistant } from "@/prisma/db/assistant";

import { AssistantCreationSchema } from "@/lib/schemas/assistant";

export async function GET(request: NextRequest) {
  const headersList = headers();
  const supabase = createClient();
  const teamId = headersList.get("x-team-id");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!teamId) {
    return NextResponse.json(
      {
        error: "Missing x-team-id header.",
      },
      {
        status: 401,
      }
    );
  }

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized action!",
      },
      {
        status: 401,
      }
    );
  }

  const assistants = await getTeamAssistants(teamId);

  return NextResponse.json(
    {
      data: assistants,
    },
    {
      status: 200,
    }
  );
}

export async function POST(request: NextRequest) {
  const headersList = headers();
  const supabase = createClient();
  const teamId = headersList.get("x-team-id");
  const body = (await request.json()) as AssistantCreationSchema;

  if (!teamId) {
    return NextResponse.json(
      {
        error: "Missing x-team-id header.",
      },
      {
        status: 401,
      }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized action!",
      },
      {
        status: 401,
      }
    );
  }

  // # create new assistant
  const assistant = await createAssistant(teamId, body);

  return NextResponse.json(
    {
      data: assistant,
    },
    {
      status: 200,
    }
  );
}

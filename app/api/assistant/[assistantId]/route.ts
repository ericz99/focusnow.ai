import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";

import {
  deleteAssistant,
  updateAssistant,
  getAssistantById,
} from "@/prisma/db/assistant";

import { isTeamMember } from "@/prisma/db/team";
import { AssistantMutationSchema } from "@/lib/schemas/assistant";

export async function GET(
  request: NextRequest,
  context: { params: { assistantId: string } }
) {
  const { assistantId } = context.params;
  const headersList = headers();
  const supabase = createClient();
  const teamId = headersList.get("x-team-id");

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

  const { id } = user;

  if (!(await isTeamMember(id, { id: teamId }))) {
    return NextResponse.json(
      {
        error: "Invalid permission!",
      },
      {
        status: 403,
      }
    );
  }

  const assistant = await getAssistantById(assistantId);

  return NextResponse.json(
    {
      data: assistant,
    },
    {
      status: 200,
    }
  );
}

export async function POST(
  request: NextRequest,
  context: { params: { assistantId: string } }
) {
  const { assistantId } = context.params;
  const headersList = headers();
  const supabase = createClient();
  const body = (await request.json()) as AssistantMutationSchema;
  const teamId = headersList.get("x-team-id");

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

  const { id } = user;

  if (!(await isTeamMember(id, { id: teamId }))) {
    return NextResponse.json(
      {
        error: "Invalid permission!",
      },
      {
        status: 403,
      }
    );
  }

  const updatedAssistant = await updateAssistant(assistantId, body);

  return NextResponse.json(
    {
      data: updatedAssistant,
    },
    {
      status: 200,
    }
  );
}

export async function DELETE(request: NextRequest) {
  const headersList = headers();
  const teamId = headersList.get("x-team-id");
  const supabase = createClient();
  const { assistantId } = (await request.json()) as { assistantId: string };

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

  const { id } = user;

  if (!(await isTeamMember(id, { id: teamId }))) {
    return NextResponse.json(
      {
        error: "Invalid permission!",
      },
      {
        status: 403,
      }
    );
  }

  // # delete assistant
  await deleteAssistant(assistantId);

  return NextResponse.json(
    {
      data: {
        message: "ok",
      },
    },
    {
      status: 200,
    }
  );
}

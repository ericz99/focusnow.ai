import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

import {
  isTeamOwner,
  isTeamMember,
  getTeamById,
  deleteTeamById,
  updateTeam,
} from "@/prisma/db/team";
import { TeamMutationSchema } from "@/lib/schemas/team";

export async function GET(
  request: NextRequest,
  context: { params: { teamId: string } }
) {
  const { teamId } = context.params;
  const supabase = createClient();
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

  const team = await getTeamById(id, { id: teamId });

  return NextResponse.json(
    {
      data: team,
    },
    {
      status: 200,
    }
  );
}

export async function POST(
  request: NextRequest,
  context: { params: { teamId: string } }
) {
  const { teamId } = context.params;
  const supabase = createClient();
  const body = (await request.json()) as TeamMutationSchema;

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

  if (!(await isTeamOwner(id, { id: teamId }))) {
    return NextResponse.json(
      {
        error: "Invalid permission!",
      },
      {
        status: 403,
      }
    );
  }

  const updatedWorkspace = await updateTeam(teamId, body);

  return NextResponse.json(
    {
      data: updatedWorkspace,
    },
    {
      status: 200,
    }
  );
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const body = (await request.json()) as { id: string };

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

  if (!(await isTeamOwner(id, body))) {
    return NextResponse.json(
      {
        error: "Invalid permission!",
      },
      {
        status: 403,
      }
    );
  }

  await deleteTeamById(body);

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

import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

import { getUserTeams } from "@/prisma/db/user";
import { createTeam } from "@/prisma/db/team";
import { TeamCreationSchema } from "@/lib/schemas/team";

export async function GET(request: NextRequest) {
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

  // # get all teams that user has
  const teams = await getUserTeams(user.id);

  return NextResponse.json(
    {
      data: teams,
    },
    {
      status: 200,
    }
  );
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = (await request.json()) as TeamCreationSchema;

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

  // # create new team
  const team = await createTeam(user.id, body);

  return NextResponse.json(
    {
      data: team,
    },
    {
      status: 200,
    }
  );
}

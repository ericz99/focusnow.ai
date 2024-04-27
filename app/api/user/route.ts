import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

import { getUser } from "@/prisma/db/user";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
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

  // # get user data
  const data = await getUser({
    supaUserId: user.id,
  });

  // # return response
  return NextResponse.json(
    {
      data,
    },
    {
      status: 200,
    }
  );
}

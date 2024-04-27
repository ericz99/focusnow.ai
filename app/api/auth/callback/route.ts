import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import {
  createNewUser,
  checkIfHasUser,
  createDefaultEnvironment,
  getUser,
  UserCreatedItemIncluded,
} from "@/prisma/db/user";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    const { user } = data;

    if (user) {
      const { id, email } = user;
      const hasUser = await checkIfHasUser({ email: email! });
      let newUser: UserCreatedItemIncluded | null = null;

      if (!hasUser) {
        // # create new user
        newUser = await createNewUser({
          supaUserId: id,
          email: email!,
        });

        // # create default environment
        await createDefaultEnvironment(user!);
      }

      // # get current user
      const _user = await getUser({
        id: newUser?.id,
      });

      // # grab teamid
      const teamId = _user!.teams[0].team.id;
      return NextResponse.redirect(`${requestUrl.origin}/app/${teamId}`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login`);
}

// https://www.youtube.com/watch?v=mcrqn77lUmM&ab_channel=DailyWebCoding

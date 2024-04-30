import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import {
  createNewUser,
  checkIfHasUser,
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

      if (!hasUser) {
        // # create new user
        await createNewUser({
          supaUserId: id,
          email: email!,
        });
      }

      return NextResponse.redirect(`${requestUrl.origin}/app/coding`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login`);
}

// https://www.youtube.com/watch?v=mcrqn77lUmM&ab_channel=DailyWebCoding

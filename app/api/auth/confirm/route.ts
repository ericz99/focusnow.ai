import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";

import {
  createNewUser,
  checkIfHasUser,
  UserCreatedItemIncluded,
} from "@/prisma/db/user";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data.user && data.session) {
      const { user } = data;

      // # only create user if its not exist
      const hasUser = await checkIfHasUser({
        email: user?.email!,
      });

      // # if no user just create an user record in our database
      if (!hasUser) {
        // # create new user
        await createNewUser({
          supaUserId: user?.id!,
          email: user?.email!,
        });
      }

      // # redirect user to their default team
      return NextResponse.redirect(`${requestUrl.origin}/app/coding`);
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}

// https://www.youtube.com/watch?v=mcrqn77lUmM&ab_channel=DailyWebCoding

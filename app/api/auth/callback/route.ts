import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createNewUser, checkIfHasUser } from "@/prisma/db/user";

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

      revalidatePath("/", "layout");

      return NextResponse.redirect(`${requestUrl.origin}/app/dashboard`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login`);
}

// https://www.youtube.com/watch?v=mcrqn77lUmM&ab_channel=DailyWebCoding

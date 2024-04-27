"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const checkAuth = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // # if user redirect them to dashboard
  if (!user) {
    redirect("/login?authenticated=false");
  }

  return user;
};

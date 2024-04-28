import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserTeams } from "@/prisma/db/user";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // # if user redirect them to dashboard
  if (user) {
    const workspaces = await getUserTeams(user.id);
    const defaultWorkspace = workspaces![0];
    redirect(`/app/${defaultWorkspace.id}?authenticated=true`);
  }

  return <>{children}</>;
}

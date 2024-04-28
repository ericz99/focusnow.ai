import React from "react";

import { SetPasswordLayout } from "@/components/layout/set-password-layout";
import { redirect, notFound } from "next/navigation";
import { checkInviteCode } from "@/prisma/db/invite";
import { getUser } from "@/prisma/db/user";

export default async function SetPassword({
  searchParams,
}: {
  searchParams: {
    code: string;
  };
}) {
  const { code } = searchParams;

  if (!code) {
    redirect("/login");
  }

  const invite = await checkInviteCode(code);

  if (!invite) {
    notFound();
  }

  const { recipientEmail } = invite;

  const user = await getUser({
    email: recipientEmail,
  });

  if (user && user.supaUserId) {
    redirect("/login");
  }

  return <SetPasswordLayout code={code} />;
}

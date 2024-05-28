import dynamic from "next/dynamic";
import React from "react";

import { getSession } from "@/prisma/db/session";
import { notFound, redirect } from "next/navigation";
import { updateSessionData } from "./actions";

const CopilotSessionLayout = dynamic(
  () => import("@/components/layouts/copliot-session-layout"),
  { ssr: false }
);

export default async function SessionPage({
  params,
}: {
  params: {
    sessionId: string;
  };
}) {
  const { sessionId } = params;

  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  if (session.isFinished) {
    // # for now just redirect, but maybe have a component that tells the user that its finished, and just redirect in 5 second to /app/interview
    redirect("/app/interview");
  }

  return (
    <CopilotSessionLayout
      session={session}
      updateSessionData={updateSessionData}
    />
  );
}

import dynamic from "next/dynamic";
import React from "react";

import { getSession } from "@/prisma/db/session";
import { notFound } from "next/navigation";
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

  return (
    <CopilotSessionLayout
      session={session}
      updateSessionData={updateSessionData}
    />
  );
}

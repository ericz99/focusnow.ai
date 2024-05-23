import dynamic from "next/dynamic";
import React from "react";

import { getSession } from "@/prisma/db/session";
import { getJob } from "@/prisma/db/job";

const CopilotSessionLayout = dynamic(
  () => import("@/components/layouts/copliot-session-layout"),
  { ssr: false }
);

export default async function SessionPage() {
  return <CopilotSessionLayout />;
}

import dynamic from "next/dynamic";
import React from "react";

const CopilotSessionLayout = dynamic(
  () => import("@/components/layouts/copliot-session-layout"),
  { ssr: false }
);

export default function SessionPage() {
  return <CopilotSessionLayout />;
}

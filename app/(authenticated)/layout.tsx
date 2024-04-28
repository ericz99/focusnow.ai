import React from "react";

import { checkAuth } from "@/lib/auth";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // # check auth
  await checkAuth();

  return <>{children}</>;
}

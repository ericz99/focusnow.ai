import React from "react";

import { checkAuth } from "@/lib/auth";
import { AI } from "./actions";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // # check auth
  await checkAuth();

  return <AI>{children}</AI>;
}

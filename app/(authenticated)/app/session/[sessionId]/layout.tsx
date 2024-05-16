import React from "react";

import { checkAuth } from "@/lib/auth";
import { getSession } from "@/prisma/db/session";
import { getDocuments } from "@/prisma/db/document";
import { getJob } from "@/prisma/db/job";
import { AI } from "./actions";
import { notFound } from "next/navigation";

export default async function SessionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    sessionId: string;
  };
}) {
  const { sessionId } = params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  // # check auth
  const user = await checkAuth();
  const docs = await getDocuments(user.id);

  // # filter and grab required document to prevent extra computation when refetching
  const reqDocs = docs?.filter(
    (d) => d.id == session.resumeId || d.id == session.coverLetterId
  );

  // # get job application
  const jobApp = await getJob(session.jobId);

  return (
    <AI
      initialAIState={{
        session: {
          ...session,
          docs: reqDocs ?? [],
          job: jobApp,
        },
        messages: [],
      }}
    >
      {children}
    </AI>
  );
}

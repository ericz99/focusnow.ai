import React from "react";

import { checkAuth } from "@/lib/auth";
import { getSession } from "@/prisma/db/session";
import { getDocuments } from "@/prisma/db/document";
import { getAllTranscript } from "@/prisma/db/transcript";
import { getJob } from "@/prisma/db/job";
import { AI } from "./actions";
import { notFound } from "next/navigation";
import { ServerMessage, UIState } from "@/lib/types";
import { UserMessage } from "@/components/internals/chat-message";
import { DeepgramContextProvider } from "@/lib/stores";

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

  // # get all transcript for session
  const transcripts = await getAllTranscript(session.id);
  const sessionMessages = transcripts?.filter((t) => t.sessionId == session.id);

  const formatMessages = sessionMessages?.map((s) => ({
    id: s.id,
    role: s.type,
    content: s.content,
    createdAt: s.createdAt,
  })) as ServerMessage[];

  // # get sorted by timestamp
  const sortedMessages = formatMessages.sort((a, b) => {
    return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
  });

  // # format as clientmessage and feed it into initialUIState
  const ui = sortedMessages.map((m) => ({
    id: m.id,
    value: m.content as string,
    display: <UserMessage>{m.content as string}</UserMessage>,
    role: m.role,
  })) as UIState;

  return (
    <AI
      initialAIState={{
        session: {
          ...session,
          docs: reqDocs ?? [],
          job: jobApp,
        },
        messages: formatMessages ?? [],
      }}
      initialUIState={ui}
    >
      <DeepgramContextProvider>{children}</DeepgramContextProvider>
    </AI>
  );
}

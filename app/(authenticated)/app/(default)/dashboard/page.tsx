import React from "react";

import { getUserSession } from "@/prisma/db/session";
import { getUserJobs } from "@/prisma/db/job";
import { getDocuments } from "@/prisma/db/document";
import { checkAuth } from "@/lib/auth";
import { Overview } from "@/components/internals/overview";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await checkAuth();
  const docs = await getDocuments(user.id);
  const jobs = await getUserJobs(user.id);
  const sessions = await getUserSession(user.id);

  // # only get success archived sessions
  const archiveSessions = sessions?.filter((s) => s.isFinished);

  // # filter resumes / coverletters
  const resumeDocs = docs?.filter((d) => d.type == "resume");
  const coverLetterDocs = docs?.filter((d) => d.type == "cover_letter");

  return (
    <div className="container relative mx-auto max-w-screen-2xl pt-12 px-4 md:px-8">
      <div className="flex flex-col gap-4 relative mb-12">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Archived Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl text-zinc-800">{archiveSessions?.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume Doc(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl text-zinc-800">{resumeDocs?.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cover Letter Doc(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl text-zinc-800">{coverLetterDocs?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col relative gap-4 mt-12 border border-solid border-zinc-200 rounded-lg p-4 bg-white">
        <h1 className="text-xl font-semibold mb-8">Usage</h1>

        <Overview />
      </div>
    </div>
  );
}

import React from "react";

import { checkAuth } from "@/lib/auth";
import { getUserJobs } from "@/prisma/db/job";
import { getDocuments } from "@/prisma/db/document";
import { getUserSession } from "@/prisma/db/session";
import { CopilotLauncher } from "@/components/internals/copilot-launcher";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { createSessionActive } from "./actions";

export default async function CopilotPage() {
  const user = await checkAuth();
  const documents = await getDocuments(user.id);
  const jobs = await getUserJobs(user.id);
  const sessions = await getUserSession(user.id);

  console.log("docs", documents);

  return (
    <div className="container flex flex-col relative mx-auto max-w-screen-2xl pt-24 px-4 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="break-normal text-lg font-medium sm:text-xl">
            Copilot Session
          </h1>
          <h2 className="text-xs text-muted-foreground sm:text-sm">
            Create new copilot session seamlessly!
          </h2>
        </div>

        <div className="flex flex-1 justify-end">
          <CopilotLauncher
            documents={documents ?? []}
            jobs={jobs ?? []}
            createSessionAction={createSessionActive}
          />
        </div>
      </div>

      <DataTable columns={columns} data={sessions ?? []} />
    </div>
  );
}

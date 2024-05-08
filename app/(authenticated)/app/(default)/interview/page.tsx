import React from "react";

import { checkAuth } from "@/lib/auth";
import { getDocuments } from "@/prisma/db/document";
import { CopilotLauncher } from "@/components/internals/copilot-launcher";

export default async function CopilotPage() {
  const user = await checkAuth();
  const documents = await getDocuments(user.id);

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
          <CopilotLauncher documents={documents ?? []} />
        </div>
      </div>
    </div>
  );
}

import React from "react";

import { checkAuth } from "@/lib/auth";
import { getDocuments } from "@/prisma/db/document";
import { UploadButtonDocument } from "@/components/internals/upload-button-document";
import { createDocumentAction } from "@/lib/actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function DocumentsPage() {
  const user = await checkAuth();
  const documents = await getDocuments(user.id);

  console.log("docs", documents);

  return (
    <div className="container flex flex-col relative mx-auto max-w-screen-2xl pt-24 px-4 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="break-normal text-lg font-medium sm:text-xl">
            Documents
          </h1>
          <h2 className="text-xs text-muted-foreground sm:text-sm">
            Upload all your docs via the uploader.
          </h2>
        </div>

        <div className="flex flex-1 justify-end">
          <UploadButtonDocument
            action={createDocumentAction}
            userId={user.id}
          />
        </div>
      </div>

      <DataTable columns={columns} data={documents ?? []} />
    </div>
  );
}

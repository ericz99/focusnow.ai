import React from "react";
import { checkAuth } from "@/lib/auth";
import { getUserJobs } from "@/prisma/db/job";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { JobCreator } from "@/components/internals/job-creator";
import { createJobAction, archiveJobAction } from "./actions";

export default async function JobsPage() {
  const user = await checkAuth();
  const jobs = await getUserJobs(user.id);

  console.log("jobs", jobs);

  return (
    <div className="container flex flex-col relative mx-auto max-w-screen-2xl pt-24 px-4 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="break-normal text-lg font-medium sm:text-xl">
            Job Application
          </h1>
          <h2 className="text-xs text-muted-foreground sm:text-sm">
            Add all job application here!
          </h2>
        </div>

        <div className="flex flex-1 justify-end">
          <JobCreator createJobAction={createJobAction} />
        </div>
      </div>

      <DataTable columns={columns} data={jobs ?? []} />
    </div>
  );
}

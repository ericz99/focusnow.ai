"use client";

import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { JobSchema } from "@/prisma/db/job";
import { JobForm } from "./job-form";

interface JobCreatorProps {
  createJobAction: (data: JobSchema) => Promise<void>;
}

export function JobCreator({ createJobAction }: JobCreatorProps) {
  const [showJobDialog, setShowJobDialog] = useState(false);

  return (
    <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-4 border border-solid border-zinc-200"
        >
          Create Job
        </Button>
      </DialogTrigger>

      <JobForm
        action={createJobAction}
        formAction={"create"}
        onClose={() => setShowJobDialog(false)}
      />
    </Dialog>
  );
}

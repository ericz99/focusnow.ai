"use client";

import React, { useState } from "react";

import { UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UploadDocumentForm from "./upload-document-form";

export type UploadButtonProps = {
  action: (formData: FormData) => Promise<
    | {
        error: string;
      }
    | {
        error: null;
      }
  >;
  userId: string;
};

export function UploadButtonDocument({ action, userId }: UploadButtonProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-4 border border-solid border-zinc-200"
          onClick={() => setOpen(true)}
        >
          <UploadIcon size={20} />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <UploadDocumentForm
              action={action}
              userId={userId}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

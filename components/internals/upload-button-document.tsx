"use client";

import React from "react";

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
  action: (formData: FormData) => Promise<void>;
  userId: string;
};

export function UploadButtonDocument({ action, userId }: UploadButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-4 border border-solid border-zinc-200"
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
            <UploadDocumentForm action={action} userId={userId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

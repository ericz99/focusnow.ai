/* eslint-disable react/no-unescaped-entities */
"use client";

import { FormEvent, useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { FileIcon, Loader2, XIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type UploadButtonFormProps = {
  action: (formData: FormData) => Promise<
    | {
        error: string;
      }
    | {
        error: null;
      }
  >;
  userId: string;
  onClose: () => void;
};

export default function UploadButtonForm({
  action,
  userId,
  onClose,
}: UploadButtonFormProps) {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [type, setType] = useState<"resume" | "cover_letter">("resume");
  const posthog = usePostHog();

  const onDrop = useCallback(
    (accepts: File[], rejects: FileRejection[]) => {
      console.log(accepts);
      if (accepts.length) {
        setAcceptedFiles([...acceptedFiles, ...accepts]);
      }

      if (rejects.length) {
        setRejectedFiles([...rejectedFiles, ...rejects]);
      }
    },
    [acceptedFiles, rejectedFiles]
  );

  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      "application/pdf": [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // # capture upload document
    posthog.capture("upload_document_begin");
    e.preventDefault();
    if (!acceptedFiles.length) return;
    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("files", file));
    formData.append("userId", userId);
    formData.append("type", type);
    setIsUploading(true);
    const { error } = await action(formData);
    setIsUploading(false);
    setAcceptedFiles([]);
    setRejectedFiles([]);

    if (error) {
      toast(error);
    } else {
      posthog.capture("upload_document_completed");
    }

    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="my-2">
        <Label className="mb-4">Document Type</Label>

        <Select
          onValueChange={(v) => setType(v as "resume" | "cover_letter")}
          value={type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type of document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="resume">Resume</SelectItem>
            <SelectItem value="cover_letter">Cover Letter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps} className="hidden" />
        <p className="text-sm">
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>

      <div className="flex flex-col gap-2 space-y-2">
        {acceptedFiles.map((file) => (
          <div
            key={`file.name_${file.lastModified}`}
            className="flex justify-between items-center"
          >
            <div className="flex-1 flex gap-2">
              <FileIcon size={20} />
              <p className="text-sm">{file.name}</p>
            </div>

            <Button type="button" variant={"ghost"} size={"icon"}>
              <XIcon size={20} />
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" variant={"default"} className="w-full">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading
          </>
        ) : (
          "Upload"
        )}
      </Button>
    </form>
  );
}

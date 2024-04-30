/* eslint-disable react/no-unescaped-entities */
"use client";

import { FormEvent, useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { FileIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export type UploadButtonFormProps = {
  action: (formData: FormData) => Promise<void>;
  userId: string;
};

export default function UploadButtonForm({
  action,
  userId,
}: UploadButtonFormProps) {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
    e.preventDefault();
    if (!acceptedFiles.length) return;
    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("files", file));
    formData.append("userId", userId);
    formData.append("type", "resume");
    setIsUploading(true);
    await action(formData);
    setIsUploading(false);

    // # TODO if error we should tell user
    // # clear all files state
    setAcceptedFiles([]);
    setRejectedFiles([]);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}

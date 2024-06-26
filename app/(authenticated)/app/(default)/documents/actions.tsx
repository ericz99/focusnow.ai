"use server";

import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { revalidatePath } from "next/cache";
import { utapi } from "@/server/uploadthing";
import { Schema, Field, Utf8 } from "apache-arrow";
import posthogServerClient from "@/server/analytic";

import {
  processCSV,
  processDocX,
  processJSON,
  processMarkdown,
  processPdf,
  processTxt,
  type FileItemChunk,
} from "@/core/ingestions";

import { llmOpenAI } from "@/core/llm/openai";

import {
  createDocument,
  createDocumentChunk,
  deleteDocument,
  type DocumentItemIncluded,
} from "@/prisma/db/document";
import { getClient } from "@/core/db/lance";
import { Table } from "vectordb";
import { checkAuth } from "@/lib/auth";

export const createDocumentAction = async (formData: FormData) => {
  "use server";

  const user = await checkAuth();
  const files = formData.getAll("files") as File[];
  const type = formData.get("type") as "resume" | "cover_letter";
  const userId = formData.get("userId") as string;

  let _temp = {} as {
    [k in string]: {
      name: string;
      ext: string;
      chunks: FileItemChunk[];
    };
  };

  for (const file of files) {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([fileBuffer]);
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    console.log("file_ext", fileExtension);

    let chunks: FileItemChunk[] = [];

    switch (fileExtension) {
      case "csv":
        chunks = await processCSV(blob);
        break;
      case "json":
        chunks = await processJSON(blob);
        break;
      case "md":
        chunks = await processMarkdown(blob);
        break;
      case "pdf":
        chunks = await processPdf(blob);
        break;
      case "txt":
        chunks = await processTxt(blob);
        break;
      default:
        throw new Error("Invalid file extension!");
    }

    _temp = {
      ..._temp,
      [file.name]: {
        ...[file.name],
        name: file.name,
        ext: fileExtension,
        chunks,
      },
    };
  }

  // # upload file to uploadthings server
  const resp = await utapi.uploadFiles(files);

  for (const fileResp of resp) {
    const { data, error } = fileResp;

    if (error) {
      posthogServerClient.capture({
        distinctId: user.id,
        event: "upload_document_error",
      });

      return {
        error: "Upload failed!",
      };
    }

    const { key, name } = data;
    const _tempData = _temp[name];

    // # create document
    const document = await createDocument({
      fileId: key,
      name,
      fileExt: _tempData.ext,
      type,
      userId,
    });

    if (!document) {
      throw new Error("Failed to create document!");
    }

    // # run in parallel?
    await Promise.all(
      _tempData.chunks.map(async (chunk, idx) => {
        // # create document chunk
        await createDocumentChunk({
          fileId: key,
          chuckIndex: idx,
          content: chunk.content,
          tokens: chunk.tokens,
          documentId: document.id,
        });
      })
    );
  }

  revalidatePath("/app/documents", "page");

  return {
    error: null,
  };
};

export const deleteDocumentAction = async (
  data: DocumentItemIncluded[] | string
) => {
  "use server";

  if (typeof data == "string") {
    const {} = data;
    await Promise.all([deleteDocument(data), utapi.deleteFiles(data)]);
  } else {
    const fileIds = data.map((d) => d!.fileId);

    // const db = await getClient();
    // const table = await db.openTable("doc-table");

    // // # delete all vector associated with key
    // await Promise.all(
    //   fileIds.map(async (id) => {
    //     // # delete data from vector
    //     await table.delete(`key = ${id}`);
    //   })
    // );

    // # delete document w/ chunks
    await Promise.all(
      fileIds.map(async (id) => {
        await deleteDocument(id);
      })
    );

    // # delete from uploadthings
    await utapi.deleteFiles(fileIds);
  }

  revalidatePath("/app/documents", "page");
};

"use server";

import { revalidatePath } from "next/cache";
import { utapi } from "@/server/uploadthing";

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

export const createDocumentAction = async (formData: FormData) => {
  "use server";

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
      throw new Error(error.message);
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

    // # create embedding
    const response = await llmOpenAI.generateEmbedding(
      _tempData.chunks.map((chunk) => chunk.content),
      "text-embedding-3-small"
    );

    let embeddings = response.data.map((item: any) => {
      return item.embedding;
    });

    console.log(embeddings.length);

    // # run in parallel?
    await Promise.all(
      _tempData.chunks.map(async (chunk, idx) => {
        // // # add into pinecone
        // await pinecone.upsert({
        //   id: `${key}_idx_chunk_${idx}`,
        //   values: embeddings[idx],
        //   metadata: {
        //     fileId: key,
        //     chunkIndex: idx,
        //     content: chunk.content,
        //   },
        // });

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

  console.log(resp);
  revalidatePath("/app/documents", "page");
};

export const deleteDocumentAction = async (data: DocumentItemIncluded[]) => {
  "use server";

  const fileIds = data.map((d) => d!.fileId);
  const docIds = data.map((d) => d!.id);

  // # delete document w/ chunks
  await Promise.all(
    docIds.map(async (id) => {
      await deleteDocument(id);
    })
  );

  // # delete from uploadthings
  await utapi.deleteFiles(fileIds);
  revalidatePath("/app/[teamId]/[assistantId]/document", "page");
};

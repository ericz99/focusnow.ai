import { getTokenLength } from "@/lib/tokenizer";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CHUNK_OVERLAP, CHUNK_SIZE } from "./constants";
import type { FileItemChunk } from "./types";

export const processJSON = async (json: Blob): Promise<FileItemChunk[]> => {
  const loader = new JSONLoader(json);
  const docs = await loader.load();
  let completeText = docs.map((doc) => doc.pageContent).join(" ");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  const splitDocs = await splitter.createDocuments([completeText]);

  let chunks: FileItemChunk[] = [];

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i];

    chunks.push({
      content: doc.pageContent,
      tokens: getTokenLength(doc.pageContent),
    });
  }

  return chunks;
};

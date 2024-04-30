import { getTokenLength } from "@/lib/tokenizer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CHUNK_OVERLAP, CHUNK_SIZE } from "./constants";
import type { FileItemChunk } from "./types";

export const processTxt = async (txt: Blob): Promise<FileItemChunk[]> => {
  const fileBuffer = Buffer.from(await txt.arrayBuffer());
  const textDecoder = new TextDecoder("utf-8");
  const textContent = textDecoder.decode(fileBuffer);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  const splitDocs = await splitter.createDocuments([textContent]);

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

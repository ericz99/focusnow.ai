import { NextResponse, NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { getClient } from "@/core/db/lance";

export async function GET(req: NextRequest) {
  const db = await getClient();
  const table = await db.openTable("doc-table");

  // # create embedding then check for embedding
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-large"),
    value: question,
  });

  // # query embedding data
  const context = await table.search(embedding).execute();

  let allContentJointed = "";

  console.log("context", context);
}

import * as z from "zod";

export const documentSchema = z.object({
  fileId: z.string(),
  fileExt: z.string(),
  name: z.string(),
});

export type DocumentSchema = z.infer<typeof documentSchema>;

export const documentChunkSchema = z.object({
  fileId: z.string(),
  chuckIndex: z.number(),
  content: z.string(),
  tokens: z.number(),
});

export type DocumentChunkSchema = z.infer<typeof documentChunkSchema>;

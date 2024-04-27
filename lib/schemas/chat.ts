import * as z from "zod";

export const chatHistoryCreationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

export type ChatHistoryCreationSchema = z.infer<
  typeof chatHistoryCreationSchema
>;

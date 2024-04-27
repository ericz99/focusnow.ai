import * as z from "zod";

export const usageCreationSchema = z.object({
  promptToken: z.number(),
  completionToken: z.number(),
  totalToken: z.number(),
});

export type UsageCreationSchema = z.infer<typeof usageCreationSchema>;

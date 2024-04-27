import * as z from "zod";

export const requestCreationSchema = z.object({
  model: z.string(),
  role: z.string(),
  content: z.string(),
});

export type RequestCreationSchema = z.infer<typeof requestCreationSchema>;

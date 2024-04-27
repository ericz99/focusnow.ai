import * as z from "zod";

export const toolSchema = z.object({
  model: z.string().optional(),
  selectedSystemPrompt: z.string().optional(),
  systemPrompt: z.string().optional(),
  welcomeMessage: z.string().optional(),
});

export type ToolSchema = z.infer<typeof toolSchema>;

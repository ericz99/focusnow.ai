import * as z from "zod";

export const assistantCreationSchema = z.object({
  name: z.string(),
  visibility: z.enum(["public", "private"]),
});

export type AssistantCreationSchema = z.infer<typeof assistantCreationSchema>;

export const assistantMutationSchema = z.object({
  name: z.string().optional(),
  visibility: z.enum(["public", "private"]).optional(),
  systemPrompt: z.string().optional().default(""),
  status: z.enum(["active", "inactive"]).optional(),
  welcomeMessage: z.string().optional().default(""),
});

export type AssistantMutationSchema = z.infer<typeof assistantMutationSchema>;

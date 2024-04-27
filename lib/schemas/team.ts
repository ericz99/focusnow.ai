import * as z from "zod";

export const teamCreationSchema = z.object({
  name: z.string(),
});

export type TeamCreationSchema = z.infer<typeof teamCreationSchema>;

export const teamMutationSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type TeamMutationSchema = z.infer<typeof teamMutationSchema>;

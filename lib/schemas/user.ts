import * as z from "zod";

export const magicLinkSchema = z.object({
  email: z.string().email(),
});

export type MagicLinkSchema = z.infer<typeof magicLinkSchema>;

export const newUserSchema = z.object({
  supaUserId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
});

export type NewUserSchema = z.infer<typeof newUserSchema>;

export const inviteUserSchema = z.object({
  email: z.string().email().optional(),
});

export type InviteUserSchema = z.infer<typeof inviteUserSchema>;

export const updateUserSchema = z.object({
  password: z.string().min(6).max(20),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const emailUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export type EmailUserSchema = z.infer<typeof emailUserSchema>;

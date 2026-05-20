import { z } from "zod";

export const profileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    jobTitle: z.string().max(80).optional().nullable()
  })
});

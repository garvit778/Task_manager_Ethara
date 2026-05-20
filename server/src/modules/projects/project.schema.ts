import { z } from "zod";

const priority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const projectCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    description: z.string().min(2).max(2000),
    deadline: z.string().datetime().optional().nullable(),
    priority: priority.default("MEDIUM"),
    teamId: z.string().optional().nullable()
  })
});

export const projectUpdateSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().min(2).max(120).optional(),
    description: z.string().min(2).max(2000).optional(),
    deadline: z.string().datetime().optional().nullable(),
    priority: priority.optional(),
    progress: z.number().int().min(0).max(100).optional(),
    teamId: z.string().optional().nullable()
  })
});

export const projectQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    priority: priority.optional(),
    status: z.enum(["ACTIVE", "OVERDUE", "COMPLETED"]).optional()
  })
});

export const inviteSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ email: z.string().email().toLowerCase() })
});

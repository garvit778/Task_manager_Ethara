import { z } from "zod";

const priority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const status = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);

export const taskCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(160),
    description: z.string().max(2000).optional(),
    projectId: z.string(),
    assigneeId: z.string().optional().nullable(),
    priority: priority.default("MEDIUM"),
    dueDate: z.string().datetime().optional().nullable(),
    status: status.default("TODO")
  })
});

export const taskUpdateSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().min(2).max(160).optional(),
    description: z.string().max(2000).optional().nullable(),
    assigneeId: z.string().optional().nullable(),
    priority: priority.optional(),
    dueDate: z.string().datetime().optional().nullable(),
    status: status.optional(),
    order: z.number().int().optional()
  })
});

export const taskQuerySchema = z.object({
  query: z.object({
    projectId: z.string().optional(),
    assigneeId: z.string().optional(),
    status: status.optional(),
    priority: priority.optional(),
    search: z.string().optional(),
    sort: z.enum(["dueDate", "priority", "createdAt"]).optional()
  })
});

export const commentCreateSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ body: z.string().min(1).max(1000) })
});

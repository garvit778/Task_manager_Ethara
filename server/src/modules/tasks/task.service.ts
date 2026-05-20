import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { emitWorkspaceEvent } from "../../sockets/index.js";

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
  project: { select: { id: true, title: true, priority: true } },
  comments: { include: { author: { select: { id: true, name: true, avatarUrl: true } } }, orderBy: { createdAt: "desc" as const } },
  attachments: true
};

const recalculateProjectProgress = async (projectId: string) => {
  const tasks = await prisma.task.findMany({ where: { projectId }, select: { status: true } });
  const progress = tasks.length ? Math.round((tasks.filter((task) => task.status === "COMPLETED").length / tasks.length) * 100) : 0;
  await prisma.project.update({ where: { id: projectId }, data: { progress } });
};

export const listTasks = async (user: Express.User, query: Record<string, unknown>) => {
  const where: Prisma.TaskWhereInput = {
    ...(query.projectId ? { projectId: String(query.projectId) } : {}),
    ...(query.assigneeId ? { assigneeId: String(query.assigneeId) } : {}),
    ...(query.status ? { status: query.status as Prisma.EnumTaskStatusFilter<"Task"> } : {}),
    ...(query.priority ? { priority: query.priority as Prisma.EnumPriorityFilter<"Task"> } : {}),
    ...(query.search ? { title: { contains: String(query.search), mode: "insensitive" } } : {}),
    ...(user.role !== "ADMIN"
      ? {
          project: {
            OR: [{ ownerId: user.id }, { team: { members: { some: { userId: user.id } } } }]
          }
        }
      : {})
  };

  return prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: query.sort ? { [String(query.sort)]: "asc" } : [{ status: "asc" }, { order: "asc" }]
  });
};

export const getTask = async (id: string, user: Express.User) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      ...(user.role !== "ADMIN"
        ? { project: { OR: [{ ownerId: user.id }, { team: { members: { some: { userId: user.id } } } }] } }
        : {})
    },
    include: taskInclude
  });
  if (!task) throw new ApiError(404, "Task not found.");
  return task;
};

export const createTask = async (data: Prisma.TaskUncheckedCreateInput, user: Express.User) => {
  const maxOrder = await prisma.task.aggregate({ where: { projectId: data.projectId }, _max: { order: true } });
  const task = await prisma.task.create({
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate as string) : undefined,
      order: (maxOrder._max.order ?? 0) + 1,
      activities: {
        create: {
          type: "TASK_CREATED",
          message: `Created task ${data.title}`,
          userId: user.id,
          projectId: data.projectId
        }
      }
    },
    include: taskInclude
  });
  await recalculateProjectProgress(task.projectId);
  emitWorkspaceEvent("task:changed", task);
  return task;
};

export const updateTask = async (id: string, data: Prisma.TaskUncheckedUpdateInput, user: Express.User) => {
  const existing = await getTask(id, user);
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate as string) : data.dueDate,
      activities: {
        create: {
          type: "TASK_UPDATED",
          message: "Updated task",
          userId: user.id,
          projectId: existing.projectId
        }
      }
    },
    include: taskInclude
  });
  await recalculateProjectProgress(task.projectId);
  emitWorkspaceEvent("task:changed", task);
  return task;
};

export const deleteTask = async (id: string, user: Express.User) => {
  const task = await getTask(id, user);
  await prisma.task.delete({ where: { id } });
  await recalculateProjectProgress(task.projectId);
  emitWorkspaceEvent("task:deleted", { id, projectId: task.projectId });
};

export const addComment = async (taskId: string, body: string, user: Express.User) => {
  const task = await getTask(taskId, user);
  const comment = await prisma.comment.create({
    data: { body, taskId, authorId: user.id },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } }
  });
  await prisma.activityLog.create({
    data: {
      type: "COMMENT_CREATED",
      message: "Added a comment",
      userId: user.id,
      projectId: task.projectId,
      taskId
    }
  });
  emitWorkspaceEvent("comment:created", comment);
  return comment;
};

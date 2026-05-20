import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { emitWorkspaceEvent } from "../../sockets/index.js";

const includeProject = {
  owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
  team: { include: { members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } } },
  tasks: { include: { assignee: { select: { id: true, name: true, email: true, avatarUrl: true } } } },
  activities: { orderBy: { createdAt: "desc" as const }, take: 8, include: { user: { select: { name: true, avatarUrl: true } } } }
};

export const listProjects = async (
  user: Express.User,
  filters: { search?: string; priority?: Prisma.EnumPriorityFilter<"Project"> | string; status?: string }
) => {
  const now = new Date();
  const where: Prisma.ProjectWhereInput = {
    ...(user.role !== "ADMIN"
      ? {
          OR: [
            { ownerId: user.id },
            { team: { members: { some: { userId: user.id } } } }
          ]
        }
      : {}),
    ...(filters.search ? { title: { contains: filters.search, mode: "insensitive" } } : {}),
    ...(filters.priority ? { priority: filters.priority as Prisma.EnumPriorityFilter<"Project"> } : {}),
    ...(filters.status === "OVERDUE" ? { deadline: { lt: now }, progress: { lt: 100 } } : {}),
    ...(filters.status === "COMPLETED" ? { progress: 100 } : {})
  };

  return prisma.project.findMany({ where, include: includeProject, orderBy: { updatedAt: "desc" } });
};

export const getProject = async (id: string, user: Express.User) => {
  const project = await prisma.project.findFirst({
    where: {
      id,
      ...(user.role !== "ADMIN"
        ? { OR: [{ ownerId: user.id }, { team: { members: { some: { userId: user.id } } } }] }
        : {})
    },
    include: includeProject
  });
  if (!project) throw new ApiError(404, "Project not found.");
  return project;
};

export const createProject = async (data: Prisma.ProjectUncheckedCreateInput, userId: string) => {
  const project = await prisma.project.create({
    data: {
      ...data,
      ownerId: userId,
      deadline: data.deadline ? new Date(data.deadline as string) : undefined,
      activities: {
        create: {
          type: "PROJECT_CREATED",
          message: `Created project ${data.title}`,
          userId
        }
      }
    },
    include: includeProject
  });
  emitWorkspaceEvent("project:changed", project);
  return project;
};

export const updateProject = async (id: string, data: Prisma.ProjectUncheckedUpdateInput, user: Express.User) => {
  await getProject(id, user);
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...data,
      deadline: data.deadline ? new Date(data.deadline as string) : data.deadline,
      activities: {
        create: {
          type: "PROJECT_UPDATED",
          message: "Updated project details",
          userId: user.id
        }
      }
    },
    include: includeProject
  });
  emitWorkspaceEvent("project:changed", project);
  return project;
};

export const deleteProject = async (id: string, user: Express.User) => {
  await getProject(id, user);
  await prisma.project.delete({ where: { id } });
  emitWorkspaceEvent("project:deleted", { id });
};

export const inviteMember = async (projectId: string, email: string, user: Express.User) => {
  const project = await getProject(projectId, user);
  const member = await prisma.user.findUnique({ where: { email } });
  if (!member) throw new ApiError(404, "No user exists with that email.");

  const team =
    project.team ??
    (await prisma.team.create({
      data: {
        name: `${project.title} Team`,
        projects: { connect: { id: project.id } }
      }
    }));

  await prisma.teamMember.upsert({
    where: { userId_teamId: { userId: member.id, teamId: team.id } },
    update: {},
    create: { userId: member.id, teamId: team.id }
  });

  await prisma.activityLog.create({
    data: {
      type: "MEMBER_INVITED",
      message: `Invited ${member.name} to ${project.title}`,
      userId: user.id,
      projectId
    }
  });

  await prisma.notification.create({
    data: {
      userId: member.id,
      title: "Project invitation",
      body: `You were invited to ${project.title}.`
    }
  });

  const updated = await getProject(projectId, user);
  emitWorkspaceEvent("project:changed", updated);
  return updated;
};

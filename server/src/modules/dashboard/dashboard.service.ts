import { prisma } from "../../config/prisma.js";
import { latestSnapshots } from "../analytics/analytics.service.js";

export const getDashboard = async (user: Express.User) => {
  const accessWhere =
    user.role === "ADMIN"
      ? {}
      : { OR: [{ ownerId: user.id }, { team: { members: { some: { userId: user.id } } } }] };

  const projects = await prisma.project.findMany({
    where: accessWhere,
    include: { tasks: true, team: { include: { members: { include: { user: true } } } } }
  });

  const tasks = projects.flatMap((project) => project.tasks);
  const now = new Date();
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  const overdue = tasks.filter((task) => task.dueDate && task.dueDate < now && task.status !== "COMPLETED").length;
  const pending = tasks.length - completed;
  const statusCounts = ["TODO", "IN_PROGRESS", "COMPLETED"].map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length
  }));
  const priorityCounts = ["LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => ({
    priority,
    count: tasks.filter((task) => task.priority === priority).length
  }));

  const activities = await prisma.activityLog.findMany({
    where: { project: accessWhere },
    take: 12,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, avatarUrl: true } }, project: { select: { title: true } } }
  });

  const members = new Map<string, { name: string; completed: number; assigned: number }>();
  for (const task of tasks) {
    if (!task.assigneeId) continue;
    const userRecord = await prisma.user.findUnique({ where: { id: task.assigneeId }, select: { name: true } });
    if (!userRecord) continue;
    const current = members.get(task.assigneeId) ?? { name: userRecord.name, assigned: 0, completed: 0 };
    current.assigned += 1;
    current.completed += task.status === "COMPLETED" ? 1 : 0;
    members.set(task.assigneeId, current);
  }

  return {
    metrics: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: completed,
      pendingTasks: pending,
      overdueTasks: overdue
    },
    statusCounts,
    priorityCounts,
    recentActivity: activities,
    productivity: Array.from(members.values()),
    sparkSnapshots: await latestSnapshots(user)
  };
};

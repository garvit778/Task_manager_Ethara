import { prisma } from "../../config/prisma.js";

export const listSnapshots = async (user: Express.User) => {
  const accessWhere =
    user.role === "ADMIN"
      ? {}
      : {
          project: {
            OR: [{ ownerId: user.id }, { team: { members: { some: { userId: user.id } } } }]
          }
        };

  return prisma.analyticsSnapshot.findMany({
    where: accessWhere,
    orderBy: { snapshotAt: "desc" },
    take: 50
  });
};

export const latestSnapshots = async (user: Express.User) => {
  const snapshots = await listSnapshots(user);
  const latestByProject = new Map<string, (typeof snapshots)[number]>();

  for (const snapshot of snapshots) {
    if (!latestByProject.has(snapshot.projectId)) {
      latestByProject.set(snapshot.projectId, snapshot);
    }
  }

  return Array.from(latestByProject.values());
};

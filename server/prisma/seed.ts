import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@projectpilot.dev" },
    update: {},
    create: {
      name: "Avery Stone",
      email: "admin@projectpilot.dev",
      password,
      role: "ADMIN",
      jobTitle: "Product Lead",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face"
    }
  });

  const member = await prisma.user.upsert({
    where: { email: "member@projectpilot.dev" },
    update: {},
    create: {
      name: "Milan Carter",
      email: "member@projectpilot.dev",
      password,
      role: "MEMBER",
      jobTitle: "Frontend Engineer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face"
    }
  });

  const designer = await prisma.user.upsert({
    where: { email: "designer@projectpilot.dev" },
    update: {},
    create: {
      name: "Rhea Kapoor",
      email: "designer@projectpilot.dev",
      password,
      role: "MEMBER",
      jobTitle: "Product Designer",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face"
    }
  });

  const team = await prisma.team.create({
    data: {
      name: "Launch Crew",
      members: {
        create: [{ userId: admin.id }, { userId: member.id }, { userId: designer.id }]
      }
    }
  });

  const project = await prisma.project.create({
    data: {
      title: "ProjectPilot GTM Launch",
      description: "Coordinate positioning, launch assets, onboarding flows, and analytics for the SaaS release.",
      priority: "HIGH",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      ownerId: admin.id,
      teamId: team.id,
      tasks: {
        create: [
          {
            title: "Finalize dashboard analytics",
            description: "Wire API metrics into the executive overview and QA empty states.",
            status: "IN_PROGRESS",
            priority: "HIGH",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
            assigneeId: member.id,
            order: 1
          },
          {
            title: "Design invitation email",
            description: "Create a polished transactional email for project invitations.",
            status: "TODO",
            priority: "MEDIUM",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            assigneeId: designer.id,
            order: 2
          },
          {
            title: "Publish deployment runbook",
            status: "COMPLETED",
            priority: "MEDIUM",
            dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
            assigneeId: admin.id,
            order: 3
          }
        ]
      },
      activities: {
        create: {
          type: "PROJECT_CREATED",
          message: "Created ProjectPilot GTM Launch",
          userId: admin.id
        }
      }
    }
  });

  const task = await prisma.task.findFirstOrThrow({ where: { projectId: project.id, title: "Finalize dashboard analytics" } });
  await prisma.comment.create({
    data: {
      body: "Analytics endpoint is ready. Please verify chart labels on mobile.",
      taskId: task.id,
      authorId: admin.id
    }
  });

  await prisma.project.update({ where: { id: project.id }, data: { progress: 33 } });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

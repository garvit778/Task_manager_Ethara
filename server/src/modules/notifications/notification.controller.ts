import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/async-handler.js";

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" }
  });
  res.json({ status: "success", data: { notifications } });
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await prisma.notification.update({
    where: { id: String(req.params.id) },
    data: { read: true }
  });
  res.json({ status: "success", data: { notification } });
});

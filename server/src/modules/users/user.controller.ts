import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/async-handler.js";

const selectUser = { id: true, name: true, email: true, role: true, avatarUrl: true, jobTitle: true };

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({ select: selectUser, orderBy: { name: "asc" } });
  res.json({ status: "success", data: { users } });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.update({ where: { id: req.user!.id }, data: req.body, select: selectUser });
  res.json({ status: "success", data: { user } });
});

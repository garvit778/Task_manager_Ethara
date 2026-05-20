import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/async-handler.js";

export const uploadAttachment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ status: "error", message: "File is required." });
    return;
  }

  const attachment = await prisma.attachment.create({
    data: {
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploaderId: req.user!.id,
      projectId: req.body.projectId || undefined,
      taskId: req.body.taskId || undefined
    }
  });

  res.status(201).json({ status: "success", data: { attachment } });
});

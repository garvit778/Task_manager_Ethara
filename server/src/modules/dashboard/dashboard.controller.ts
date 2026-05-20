import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import * as service from "./dashboard.service.js";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await service.getDashboard(req.user!);
  res.json({ status: "success", data: dashboard });
});

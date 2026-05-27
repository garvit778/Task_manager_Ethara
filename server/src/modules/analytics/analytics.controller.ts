import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import * as service from "./analytics.service.js";

export const listSnapshots = asyncHandler(async (req: Request, res: Response) => {
  const snapshots = await service.listSnapshots(req.user!);
  res.json({ status: "success", data: { snapshots } });
});

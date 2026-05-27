import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { listSnapshots } from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.get("/snapshots", authenticate, listSnapshots);

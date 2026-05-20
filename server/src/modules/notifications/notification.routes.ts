import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import * as controller from "./notification.controller.js";

export const notificationRouter = Router();

notificationRouter.use(authenticate);
notificationRouter.get("/", controller.listNotifications);
notificationRouter.patch("/:id/read", controller.markRead);

import { Router } from "express";
import { attachmentRouter } from "./modules/attachments/attachment.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { notificationRouter } from "./modules/notifications/notification.routes.js";
import { projectRouter } from "./modules/projects/project.routes.js";
import { taskRouter } from "./modules/tasks/task.routes.js";
import { userRouter } from "./modules/users/user.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ status: "ok", service: "ProjectPilot API" }));
apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/projects", projectRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/attachments", attachmentRouter);

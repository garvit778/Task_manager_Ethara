import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as controller from "./project.controller.js";
import { inviteSchema, projectCreateSchema, projectQuerySchema, projectUpdateSchema } from "./project.schema.js";

export const projectRouter = Router();

projectRouter.use(authenticate);
projectRouter.get("/", validate(projectQuerySchema), controller.listProjects);
projectRouter.post("/", validate(projectCreateSchema), controller.createProject);
projectRouter.get("/:id", controller.getProject);
projectRouter.patch("/:id", validate(projectUpdateSchema), controller.updateProject);
projectRouter.delete("/:id", authorize("ADMIN"), controller.deleteProject);
projectRouter.post("/:id/invite", validate(inviteSchema), controller.inviteMember);

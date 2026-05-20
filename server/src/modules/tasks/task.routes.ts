import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as controller from "./task.controller.js";
import { commentCreateSchema, taskCreateSchema, taskQuerySchema, taskUpdateSchema } from "./task.schema.js";

export const taskRouter = Router();

taskRouter.use(authenticate);
taskRouter.get("/", validate(taskQuerySchema), controller.listTasks);
taskRouter.post("/", validate(taskCreateSchema), controller.createTask);
taskRouter.get("/:id", controller.getTask);
taskRouter.patch("/:id", validate(taskUpdateSchema), controller.updateTask);
taskRouter.delete("/:id", controller.deleteTask);
taskRouter.post("/:id/comments", validate(commentCreateSchema), controller.addComment);

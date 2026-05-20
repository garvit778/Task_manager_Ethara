import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import * as service from "./task.service.js";

export const listTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await service.listTasks(req.user!, req.query);
  res.json({ status: "success", data: { tasks } });
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await service.getTask(String(req.params.id), req.user!);
  res.json({ status: "success", data: { task } });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await service.createTask(req.body, req.user!);
  res.status(201).json({ status: "success", data: { task } });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await service.updateTask(String(req.params.id), req.body, req.user!);
  res.json({ status: "success", data: { task } });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteTask(String(req.params.id), req.user!);
  res.status(204).send();
});

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await service.addComment(String(req.params.id), req.body.body, req.user!);
  res.status(201).json({ status: "success", data: { comment } });
});

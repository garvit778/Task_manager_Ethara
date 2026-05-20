import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import * as service from "./project.service.js";

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await service.listProjects(req.user!, req.query);
  res.json({ status: "success", data: { projects } });
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await service.getProject(String(req.params.id), req.user!);
  res.json({ status: "success", data: { project } });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await service.createProject(req.body, req.user!.id);
  res.status(201).json({ status: "success", data: { project } });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await service.updateProject(String(req.params.id), req.body, req.user!);
  res.json({ status: "success", data: { project } });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteProject(String(req.params.id), req.user!);
  res.status(204).send();
});

export const inviteMember = asyncHandler(async (req: Request, res: Response) => {
  const project = await service.inviteMember(String(req.params.id), req.body.email, req.user!);
  res.json({ status: "success", data: { project } });
});

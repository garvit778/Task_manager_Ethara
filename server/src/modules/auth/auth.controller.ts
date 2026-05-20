import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import * as authService from "./auth.service.js";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const payload = await authService.signup(req.body);
  res.status(201).json({ status: "success", data: payload });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = await authService.login(req.body.email, req.body.password);
  res.json({ status: "success", data: payload });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.me(req.user!.id);
  res.json({ status: "success", data: { user } });
});

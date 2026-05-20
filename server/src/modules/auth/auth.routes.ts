import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as controller from "./auth.controller.js";
import { loginSchema, signupSchema } from "./auth.schema.js";

export const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), controller.signup);
authRouter.post("/login", validate(loginSchema), controller.login);
authRouter.get("/me", authenticate, controller.me);

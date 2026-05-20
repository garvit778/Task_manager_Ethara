import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as controller from "./user.controller.js";
import { profileSchema } from "./user.schema.js";

export const userRouter = Router();

userRouter.use(authenticate);
userRouter.get("/", controller.listUsers);
userRouter.patch("/me", validate(profileSchema), controller.updateProfile);

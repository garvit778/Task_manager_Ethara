import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import { uploadAttachment } from "./attachment.controller.js";

export const attachmentRouter = Router();

attachmentRouter.post("/", authenticate, upload.single("file"), uploadAttachment);

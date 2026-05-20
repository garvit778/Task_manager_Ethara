import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.originalUrl} was not found.`));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong.";
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = "Validation failed.";
    details = err.flatten();
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid or expired authentication token.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = err.code === "P2002" ? 409 : 400;
    message = err.code === "P2002" ? "A record with this value already exists." : "Database request failed.";
    details = err.meta;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    status: "error",
    message,
    details: env.NODE_ENV === "production" && statusCode === 500 ? undefined : details
  });
};

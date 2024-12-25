import { ApiError, AppError, DatabaseError, UnknownError } from "../errors"; // Custom error classes
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: AppError, // This ensures that err is recognized as an AppError (or its subclasses)
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  // Handle specific custom error types
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({
      message: "Internal Database Error",
      error: err.message,
    });
  }

  if (err instanceof UnknownError) {
    return res.status(500).json({
      message: "An unknown error occurred",
      error: err.message,
    });
  }

  // Fallback for any unhandled error type
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
}

export default errorHandler;

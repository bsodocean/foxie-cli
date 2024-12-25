// src/errors.ts

// Base class for custom errors
export class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

// Specific error classes
export class ApiError extends AppError {
  constructor(message: string) {
    super(message, 400); // Bad Request
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500); // Internal Server Error
  }
}

export class UnknownError extends AppError {
  constructor(message: string) {
    super(message, 500); // Internal Server Error
  }
}

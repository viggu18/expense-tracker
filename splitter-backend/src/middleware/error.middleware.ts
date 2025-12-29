import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  message: string;
  stack?: string;
  statusCode?: number;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error with detailed information
  console.error(
    `[${new Date().toISOString()}] ERROR ${req.method} ${req.path} - ${
      err.message
    }`
  );
  console.error(`  Status: ${err.statusCode || 500}`);
  console.error(`  Stack: ${err.stack}`);
  console.error(`  IP: ${req.ip}`);

  // Log request body for context (excluding sensitive data)
  if (req.body && Object.keys(req.body).length > 0) {
    const filteredBody = { ...req.body };
    // Remove sensitive fields if they exist
    delete filteredBody.password;
    delete filteredBody.token;
    console.error(`  Request Body: ${JSON.stringify(filteredBody, null, 2)}`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    error = { message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

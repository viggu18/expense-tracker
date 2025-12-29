import { Request, Response, NextFunction } from 'express';

// Logging middleware to log all requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log incoming request
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`
  );

  // Log request body for non-GET requests (but be careful with sensitive data)
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    console.log(`  Request Body: ${JSON.stringify(req.body, null, 2)}`);
  }

  // Log request headers (excluding sensitive ones)
  const filteredHeaders = { ...req.headers };
  delete filteredHeaders.authorization;
  delete filteredHeaders.cookie;

  // Capture the original send function to log response
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - Status: ${
        res.statusCode
      } - Duration: ${duration}ms`
    );

    // Log response body for errors
    if (res.statusCode >= 400 && body) {
      console.log(
        `  Response Body: ${
          typeof body === 'string' ? body : JSON.stringify(body, null, 2)
        }`
      );
    }

    // Call the original send function
    return originalSend.call(this, body);
  };

  next();
};

// Error logging middleware
export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(
    `[${new Date().toISOString()}] ERROR ${req.method} ${req.path} - ${
      error.message
    }`
  );
  console.error(`  Stack: ${error.stack}`);
  next(error);
};

export default {
  requestLogger,
  errorLogger,
};

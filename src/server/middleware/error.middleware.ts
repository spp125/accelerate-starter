/**
 * Error Handling Middleware
 * Centralized error handling for Express
 */
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
}

/**
 * Global error handler middleware
 * This should be the last middleware in the chain
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env['NODE_ENV'] === 'development' && {
        stack: err.stack,
        code: err.code,
      }),
    },
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.url} not found`,
    },
  });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

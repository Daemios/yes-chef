/**
 * Error handling middleware
 * Provides centralized error handling for Express routes
 */
import { Request, Response, NextFunction } from 'express';

// Define custom error interface
interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

/**
 * Central error handling middleware
 */
export const errorMiddleware = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);
  
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] = [];
  
  // Check if it's one of our AppErrors with a status code
  if ('statusCode' in err) {
    statusCode = err.statusCode || 500;
    message = err.message || 'An error occurred';
    errors = err.errors || [];
  } else if (err.name === 'ValidationError') {
    // Handle validation errors
    statusCode = 400;
    message = 'Validation Error';
  }
  
  // Return error response
  res.status(statusCode).json({
    status: 'error',
    message,
    errors: errors.length ? errors : undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

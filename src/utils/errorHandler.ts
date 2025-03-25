import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/appError';
import { logger } from './logging';

/**
 * Handles Mongoose CastError (Invalid ObjectId, etc.)
 */
const handleCastErrorDB = (err: mongoose.Error.CastError): AppError => {
  return new AppError(`Invalid value '${err.value}' for field '${err.path}'`, 400);
};

/**
 * Handles Duplicate Field Errors (MongoDB)
 */
const handleDuplicateFieldsDB = (): AppError => {
  return new AppError('Duplicate field value. Please use a unique value.', 400);
};

/**
 * Handles JWT Errors (Invalid or Expired)
 */
const handleJWTError = (): AppError => new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Token expired. Please log in again.', 401);

/**
 * Handles Syntax Errors (e.g., Invalid JSON in request body)
 */
const handleSyntaxError = (): AppError => new AppError('Invalid JSON syntax in request body.', 400);

/**
 * Handles Rate Limit Errors (e.g., Too Many Requests)
 */
const handleRateLimitError = (): AppError =>
  new AppError('Too many requests. Please try again later.', 429);

/**
 * Sends Error Response in Development Mode
 */
const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  if (res.headersSent) return;

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * Sends Error Response in Production Mode
 */
const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (res.headersSent) return;

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

/**
 * Global Error Handling Middleware
 */
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error =
    err instanceof AppError
      ? err
      : new AppError(err.message || 'An unexpected error occurred', err.statusCode || 500);

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // Handle Specific Error Types
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(
      (e) => (e as mongoose.Error.ValidatorError).message,
    );
    error = new AppError(messages.join(', '), 400);
  }
  if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
  if ((err as any).code === 11000) error = handleDuplicateFieldsDB();
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (err instanceof SyntaxError && 'body' in err) error = handleSyntaxError();
  if (err.status === 429) error = handleRateLimitError();

  // Handle Express-Specific Errors
  if (err.code === 'EBADCSRFTOKEN') {
    error = new AppError('Invalid CSRF token. Please refresh and try again.', 403);
  }
  if (err.code === 'ECONNREFUSED') {
    error = new AppError('Database connection refused. Please try again later.', 503);
  }

  // Log error (Ensure logs are available in production)
  logger.error({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Hide stack in production
    status: error.status,
    statusCode: error.statusCode,
  });

  // Send appropriate error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

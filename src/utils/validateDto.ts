import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './appError';

/**
 * Validates request data (body, query, or headers) using a DTO class.
 * - Supports `req.body`, `req.query`, and `req.headers`
 * - Provides detailed validation error messages
 * - Enforces strict validation (`whitelist` and `forbidNonWhitelisted`)
 *
 * @param DtoClass The DTO class to validate against
 * @param source The request source: "body" (default), "query", or "headers"
 */
export const validateDto = (DtoClass: any, source: 'body' | 'query' | 'headers' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const dtoInstance = plainToInstance(DtoClass, data);
    const errors = await validate(dtoInstance, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      return next(new AppError(JSON.stringify(formatErrors(errors)), 400));
    }

    req[source] = dtoInstance; // Override request data with validated DTO
    next();
  };
};

/**
 * Formats validation errors into a structured response.
 *
 * @param errors Array of validation errors
 * @returns Formatted error object with field names and corresponding errors
 */
const formatErrors = (errors: any[]) => {
  return errors.map((e) => ({
    field: e.property,
    errors: Object.values(e.constraints || {}),
  }));
};

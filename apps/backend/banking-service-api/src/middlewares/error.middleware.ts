import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ErrorResponse } from '../types/api.types';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    statusCode: number;
    errors?: any[];

    constructor(statusCode: number, message: string, errors?: any[]) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

/**
 * Error handler middleware
 * Catches all errors and formats them appropriately for API responses
 */
export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    let statusCode = 500;
    let errorResponse: ErrorResponse;

    // Handle known API errors
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        errorResponse = {
            code: statusCode,
            message: err.message,
        };

        // Log error with appropriate level based on status code
        if (statusCode >= 500) {
            logger.error(`API Error: ${err.message}`, { statusCode, path: req.path, errors: err.errors });
        } else {
            logger.warn(`API Error: ${err.message}`, { statusCode, path: req.path, errors: err.errors });
        }
    }
    // Handle Prisma errors
    else if (err.name === 'PrismaClientKnownRequestError' || err.name === 'PrismaClientValidationError') {
        statusCode = 400;
        errorResponse = {
            code: statusCode,
            message: 'Database operation failed'
        };
        logger.error(`Prisma Error: ${err.message}`, { stack: err.stack });
    }
    // Handle validation errors from express-validator
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        errorResponse = {
            code: statusCode,
            message: err.message
        };
    }
    // Handle unknown errors
    else {
        errorResponse = {
            code: statusCode,
            message: 'Internal server error'
        };
        logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
};

/**
 * Not found middleware
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (req: Request, res: Response) => {
    const errorResponse: ErrorResponse = {
        code: 404,
        message: `Route not found: ${req.method} ${req.path}`
    };

    logger.warn(`Route not found: ${req.method} ${req.path}`);
    res.status(404).json(errorResponse);
};

/**
 * Async handler to avoid try-catch blocks in route handlers
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

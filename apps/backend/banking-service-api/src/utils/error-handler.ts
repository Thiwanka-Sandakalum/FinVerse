import type { ErrorRequestHandler } from 'express';
import type { NextFunction } from 'express';
import { logger } from '../config/logger';
import type { Request, Response } from '../types/api.types';

// Types
export interface ApiError extends Error {
    status: number;
    errors?: any[];
    code?: string;
}

interface ErrorResponse {
    status: string;
    message: string;
    errors?: any[];
    stack?: string;
}

// Pure function to create custom error types
const createCustomError = (name: string, defaultStatus: number): new (message: string, status?: number) => ApiError =>
    class extends Error implements ApiError {
        status: number;
        constructor(message: string, status: number = defaultStatus) {
            super(message);
            this.name = name;
            this.status = status;
        }
    };

// Custom error types
export const NotFoundError = createCustomError('NotFoundError', 404);
export const ValidationError = createCustomError('ValidationError', 400);
export const ConflictError = createCustomError('ConflictError', 409);

// Pure function to create error response
const createErrorResponse = (error: ApiError): ErrorResponse => ({
    status: 'error',
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
});

// Pure function to map Prisma errors to API errors
const mapPrismaError = (error: { code: string }): ApiError => {
    switch (error.code) {
        case 'P2002':
            return new ConflictError('A record with this identifier already exists');
        case 'P2025':
            return new NotFoundError('Record not found');
        default:
            return Object.assign(new Error('Internal server error'), { status: 500 });
    }
};

// Pure function to create error handler middleware
export const createErrorHandler = (): ErrorRequestHandler => {
    return (error: ApiError | Error, req: Request, res: Response, next: NextFunction): void => {
        const mappedError = 'code' in error ? mapPrismaError(error as { code: string }) : error as ApiError;
        const statusCode = 'status' in mappedError ? mappedError.status : 500;

        // Log error
        logger.error(`Error ${statusCode}: ${mappedError.message}`, {
            path: req.path,
            method: req.method,
            error: mappedError
        });

        res.status(statusCode).json(createErrorResponse(mappedError as ApiError));
    };
};

// Pure function to wrap async handlers
type AsyncHandler<P = {}, ResBody = any, ReqBody = any> =
    (req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFunction) => Promise<any>;

export const asyncHandler = <P = {}, ResBody = any, ReqBody = any>(fn: AsyncHandler<P, ResBody, ReqBody>) =>
    (req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { apiError } from '../utils/response';
import { logger } from '../config/logger';

export function errorHandler(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let status = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let details: any[] = [];

    if (err instanceof AppError) {
        status = err.status;
        code = err.code;
        message = err.message;
        details = err.details || [];
    } else if ((err as any).status) {
        status = (err as any).status;
        message = err.message;

        // OpenAPI validator error
        if ((err as any).errors && Array.isArray((err as any).errors)) {
            code = 'INVALID_INPUT';
            details = (err as any).errors.map((e: any) => ({
                field: e.path,
                message: e.message,
                code: e.errorCode
            }));
        }
    }

    logger.error('API Error', {
        status,
        code,
        message,
        details,
        path: req.path,
        method: req.method
    });

    return apiError(res, {
        status,
        message,
        code,
        details
    });
}
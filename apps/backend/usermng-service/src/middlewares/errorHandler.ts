/**
 * Centralized Error Handler Middleware
 * Returns standardized error responses
 */

import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

/**
 * Global error handler middleware
 * Uses standardized error response envelope
 */
export default function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error('Error:', error);

    const requestId = req.id;

    // Handle known error types
    switch (error.name) {
        case 'ValidationError':
            errorResponse(
                res,
                'Validation failed',
                'VALIDATION_ERROR',
                400,
                [{ field: 'unknown', message: error.message }],
                requestId
            );
            return;

        case 'UnauthorizedError':
            errorResponse(
                res,
                'Missing or invalid access token',
                'UNAUTHORIZED',
                401,
                undefined,
                requestId
            );
            return;

        case 'ForbiddenError':
            errorResponse(
                res,
                'Insufficient permissions for this operation',
                'FORBIDDEN',
                403,
                undefined,
                requestId
            );
            return;

        case 'NotFoundError':
        case 'UserNotFoundError':
            errorResponse(
                res,
                error.message || 'Resource not found',
                'NOT_FOUND',
                404,
                undefined,
                requestId
            );
            return;

        case 'ConflictError':
            errorResponse(
                res,
                error.message,
                'CONFLICT',
                409,
                undefined,
                requestId
            );
            return;

        case 'Auth0Error':
            // Map Auth0 status codes to appropriate responses
            const statusCode = error.statusCode || 500;
            const errorCode = mapStatusToCode(statusCode);
            errorResponse(
                res,
                error.message || 'Auth0 operation failed',
                errorCode,
                statusCode,
                undefined,
                requestId
            );
            return;

        default:
            errorResponse(
                res,
                'An unexpected error occurred',
                'INTERNAL_SERVER_ERROR',
                500,
                undefined,
                requestId
            );
    }
}

/**
 * Map HTTP status codes to error codes
 */
function mapStatusToCode(status: number): string {
    const codeMap: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        500: 'INTERNAL_SERVER_ERROR',
    };
    return codeMap[status] || 'UNKNOWN_ERROR';
}

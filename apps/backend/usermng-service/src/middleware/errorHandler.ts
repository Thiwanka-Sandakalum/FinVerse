/**
* Centralized error handler middleware for Express
* Returns error responses matching OpenAPI Error schema
*/
import { Request, Response, NextFunction } from 'express';
import { errorResponses } from '../utils/response';

/**
 * Global error handler middleware
 * Returns error responses matching OpenAPI Error schema
 */
export default function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Error:', error);

    // Handle known error types
    switch (error.name) {
        case 'ValidationError':
            return errorResponses.validationError(res, error.message);

        case 'UnauthorizedError':
            return errorResponses.unauthorized(res, 'Missing or invalid access token');

        case 'ForbiddenError':
            return errorResponses.forbidden(res, 'Insufficient permissions for this operation');

        case 'NotFoundError':
        case 'UserNotFoundError':
            return errorResponses.notFound(res, error.message || 'Resource not found');

        case 'ConflictError':
            return errorResponses.conflict(res, error.message);

        case 'Auth0Error':
            // Map Auth0 status codes to appropriate responses
            switch (error.statusCode) {
                case 400:
                    return errorResponses.validationError(res, error.message);
                case 401:
                    return errorResponses.unauthorized(res, error.message);
                case 403:
                    return errorResponses.forbidden(res, error.message);
                case 404:
                    return errorResponses.notFound(res, error.message);
                case 409:
                    return errorResponses.conflict(res, error.message);
                default:
                    return errorResponses.internalError(res, error.message);
            }

        default:
            return errorResponses.internalError(res);
    }
}

import { Response } from 'express';
import { ErrorResponse, PaginatedResponse, SingleItemResponse, SuccessResponse, ResponseCodes } from '../interfaces/response';

/**
 * Send a paginated response
 */
export function sendPaginatedResponse<T>(
    res: Response,
    items: T[],
    page: number,
    limit: number,
    total: number
): void {
    const response: PaginatedResponse<T> = {
        pagination: { page, limit, total },
        items
    };
    res.status(200).json(response);
}

/**
 * Send a single item response
 */
export function sendItemResponse<T>(res: Response, data: T): void {
    const response: SingleItemResponse<T> = { data };
    res.status(200).json(response);
}

/**
 * Send a success response (for operations that don't return data)
 */
export function sendSuccessResponse(res: Response, message?: string, status: number = 200): void {
    const response: SuccessResponse = { success: true, message };
    res.status(status).json(response);
}

/**
 * Send a no content response (204)
 */
export function sendNoContentResponse(res: Response): void {
    res.status(204).send();
}

/**
 * Send an error response
 */
export function sendErrorResponse(
    res: Response,
    status: number,
    code: string,
    message: string
): void {
    const response: ErrorResponse = { status, code, message };
    res.status(status).json(response);
}

/**
 * Common error response helpers
 */
export const errorResponses = {
    badRequest: (res: Response, message: string = 'Bad request') =>
        sendErrorResponse(res, 400, ResponseCodes.BAD_REQUEST, message),

    unauthorized: (res: Response, message: string = 'Unauthorized') =>
        sendErrorResponse(res, 401, ResponseCodes.UNAUTHORIZED, message),

    forbidden: (res: Response, message: string = 'Forbidden') =>
        sendErrorResponse(res, 403, ResponseCodes.FORBIDDEN, message),

    notFound: (res: Response, message: string = 'Resource not found') =>
        sendErrorResponse(res, 404, ResponseCodes.NOT_FOUND, message),

    conflict: (res: Response, message: string = 'Resource conflict') =>
        sendErrorResponse(res, 409, ResponseCodes.CONFLICT, message),

    validationError: (res: Response, message: string = 'Validation failed') =>
        sendErrorResponse(res, 400, ResponseCodes.VALIDATION_ERROR, message),

    internalError: (res: Response, message: string = 'Internal server error') =>
        sendErrorResponse(res, 500, ResponseCodes.INTERNAL_ERROR, message)
};

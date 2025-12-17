/**
 * Standardized API Response Utilities
 */

import { Response } from 'express';
import { ApiErrorResponse, ApiSuccessResponse, ErrorResponse, PaginatedData, PaginatedResponse, ResponseCodes, ResponseMeta, SingleItemResponse, SuccessResponse } from '../interfaces/response';

/**
 * Generate response metadata
 */
function generateMeta(requestId?: string): ResponseMeta {
    return {
        requestId,
        timestamp: new Date().toISOString()
    };
}

/**
 * Send a standardized success response
 */
export function successResponse<T>(
    res: Response,
    data: T,
    message: string,
    statusCode: number = 200,
    requestId?: string
): void {
    const response: ApiSuccessResponse<T> = {
        success: true,
        message,
        data,
        meta: generateMeta(requestId)
    };
    res.status(statusCode).json(response);
}

/**
 * Send a standardized error response
 */
export function errorResponse(
    res: Response,
    message: string,
    errorCode: string,
    statusCode: number = 500,
    details?: any[],
    requestId?: string
): void {
    const response: ApiErrorResponse = {
        success: false,
        message,
        error: {
            code: errorCode,
            details
        },
        meta: generateMeta(requestId)
    };
    res.status(statusCode).json(response);
}

/**
 * Send created response (201)
 */
export function createdResponse<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully',
    requestId?: string
): void {
    successResponse(res, data, message, 201, requestId);
}

/**
 * Send updated response (200)
 */
export function updatedResponse<T>(
    res: Response,
    data: T,
    message: string = 'Resource updated successfully',
    requestId?: string
): void {
    successResponse(res, data, message, 200, requestId);
}

/**
 * Send deleted response (200)
 */
export function deletedResponse(
    res: Response,
    message: string = 'Resource deleted successfully',
    requestId?: string
): void {
    successResponse(res, null, message, 200, requestId);
}

/**
 * Send paginated response (200)
 */
export function paginatedResponse<T>(
    res: Response,
    items: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Data retrieved successfully',
    requestId?: string
): void {
    const data: PaginatedData<T> = {
        items,
        pagination: { page, limit, total }
    };
    successResponse(res, data, message, 200, requestId);
}

/**
 * Send single item response (200)
 */
export function itemResponse<T>(
    res: Response,
    data: T,
    message: string = 'Data retrieved successfully',
    requestId?: string
): void {
    successResponse(res, data, message, 200, requestId);
}

// ============================================================================
// LEGACY FUNCTIONS (Backward Compatibility) - Will be deprecated
// ============================================================================

/**
 * @deprecated Use paginatedResponse() instead
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
 * @deprecated Use itemResponse() instead
 */
export function sendItemResponse<T>(res: Response, data: T): void {
    const response: SingleItemResponse<T> = { data };
    res.status(200).json(response);
}

/**
 * @deprecated Use successResponse() instead
 */
export function sendSuccessResponse(res: Response, message?: string, status: number = 200): void {
    const response: SuccessResponse = { status, data: null, message };
    res.status(status).json(response);
}

/**
 * @deprecated Use deletedResponse() instead
 */
export function sendNoContentResponse(res: Response): void {
    res.status(204).send();
}

/**
 * @deprecated Use errorResponse() instead
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
    badRequest: (res: Response, message: string = 'Bad request', requestId?: string) =>
        errorResponse(res, message, 'BAD_REQUEST', 400, undefined, requestId),

    unauthorized: (res: Response, message: string = 'Unauthorized', requestId?: string) =>
        errorResponse(res, message, 'UNAUTHORIZED', 401, undefined, requestId),

    forbidden: (res: Response, message: string = 'Forbidden', requestId?: string) =>
        errorResponse(res, message, 'FORBIDDEN', 403, undefined, requestId),

    notFound: (res: Response, message: string = 'Resource not found', requestId?: string) =>
        errorResponse(res, message, 'NOT_FOUND', 404, undefined, requestId),

    conflict: (res: Response, message: string = 'Resource conflict', requestId?: string) =>
        errorResponse(res, message, 'CONFLICT', 409, undefined, requestId),

    validationError: (res: Response, message: string = 'Validation failed', details?: any[], requestId?: string) =>
        errorResponse(res, message, 'VALIDATION_ERROR', 400, details, requestId),

    internalError: (res: Response, message: string = 'Internal server error', requestId?: string) =>
        errorResponse(res, message, 'INTERNAL_SERVER_ERROR', 500, undefined, requestId)
};

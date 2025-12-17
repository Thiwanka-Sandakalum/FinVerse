/**
 * API Response Interface Definitions
 */

// ============================================================================
// Standardized Response Interfaces
// ============================================================================

/**
 * Response metadata included in all responses
 */
export interface ResponseMeta {
    requestId?: string;
    timestamp: string;
}

/**
 * Standard success response envelope
 */
export interface ApiSuccessResponse<T = any> {
    success: true;
    message: string;
    data: T;
    meta: ResponseMeta;
}

/**
 * Error detail for field-level validation errors
 */
export interface ErrorDetail {
    field: string;
    message: string;
    code?: string;
}

/**
 * Standard error response envelope
 */
export interface ApiErrorResponse {
    success: false;
    message: string;
    error: {
        code: string;
        details?: ErrorDetail[];
    };
    meta: ResponseMeta;
}

/**
 * Paginated data structure
 */
export interface PaginatedData<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

/**
 * Response status codes
 */
export const ResponseCodes = {
    SUCCESS: 200,
    CREATED: 201,
    UPDATED: 200,
    DELETED: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// ============================================================================
// Legacy Interfaces (Deprecated - kept for backward compatibility)
// ============================================================================

/**
 * @deprecated Use ApiSuccessResponse instead
 */
export interface SuccessResponse<T = any> {
    status: number;
    data: T;
    message?: string;
}

/**
 * @deprecated Use ApiErrorResponse instead
 */
export interface ErrorResponse {
    status: number;
    code: string;
    message: string;
    details?: any[];
}

/**
 * @deprecated Use PaginatedData instead
 */
export interface PaginatedResponse<T> {
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
    items: T[];
}

/**
 * @deprecated Use ApiSuccessResponse with single item data instead
 */
export interface SingleItemResponse<T> {
    data: T;
}

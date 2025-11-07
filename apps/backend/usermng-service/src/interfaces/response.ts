import { Response } from 'express';

export interface Pagination {
    page: number;
    limit: number;
    total: number;
}

export interface ErrorResponse {
    status: number;
    code: string;
    message: string;
}

export interface PaginatedResponse<T> {
    pagination: Pagination;
    items: T[];
}

export interface SingleItemResponse<T> {
    data: T;
}

export interface SuccessResponse {
    success: true;
    message?: string;
}

// Standard response codes
export const ResponseCodes = {
    BAD_REQUEST: 'bad_request',
    UNAUTHORIZED: 'unauthorized',
    FORBIDDEN: 'forbidden',
    NOT_FOUND: 'not_found',
    CONFLICT: 'conflict',
    INTERNAL_ERROR: 'internal_error',
    VALIDATION_ERROR: 'validation_error'
} as const;
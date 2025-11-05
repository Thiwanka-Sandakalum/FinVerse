import { ErrorResponse, MessageResponse, PaginatedResponse } from '../types';

// Helper functions to create response objects that match the OpenAPI schema types
export const createErrorResponse = (code: number, message: string): ErrorResponse => ({
    code,
    message
});

export const createMessageResponse = (message: string): MessageResponse => ({
    message
});

export const createPaginatedResponse = (
    data: any[],
    total: number,
    limit: number,
    offset: number
): PaginatedResponse => ({
    data,
    meta: {
        total,
        limit,
        offset
    }
});
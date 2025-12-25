import type { Request } from 'express';
import type { Response } from 'express';

export { type Request, type Response };

// Auth related types
export interface JwtPayload {
    userId: string;
    institutionId?: string;
    role: string;
    iat: number;
    exp: number;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

// Institution Type related types
export interface InstitutionTypeCreateDto {
    code: string;
    name: string;
    description?: string;
}

export interface InstitutionTypeUpdateDto {
    name?: string;
    description?: string;
}

// Institution related types
export interface InstitutionCreateDto {
    typeId: string;
    name: string;
    logoUrl?: string;
    licenseNumber?: string;
    countryCode: string;
}

export interface InstitutionUpdateDto {
    typeId?: string;
    name?: string;
    logoUrl?: string;
    licenseNumber?: string;
    countryCode?: string;
}

export interface InstitutionActivateDto {
    isActive: boolean;
}

// Product Category related types
export interface ProductCategoryCreateDto {
    parentId?: string;
    name: string;
    description?: string;
}

export interface ProductCategoryUpdateDto {
    parentId?: string;
    name?: string;
    description?: string;
}

// Product related types
export interface ProductCreateDto {
    institutionId: string;
    categoryId: string;
    name: string;
    details?: Record<string, any>;
    isFeatured?: boolean;
}

export interface ProductUpdateDto {
    name?: string;
    categoryId?: string;
    details?: Record<string, any>;
    isFeatured?: boolean;
}

export interface ProductActivateDto {
    isActive: boolean;
}

// Product Rate History related types
export interface ProductRateHistoryCreateDto {
    metric: string;
    value: number;
    currency?: string;
    source?: string;
}

// Product Batch related types
export interface ProductBatchRequestDto {
    productIds: string[];
}

export interface ProductBatchResponseDto {
    data: any[];
    meta: {
        requested: number;
        found: number;
        notFound: number;
    };
}

// Saved Product related types
export interface SavedProductCreateDto {
    productId: string;
}

// Compare List related types
export interface CompareListCreateDto {
    productIds: string[];
}

// Shared Product related types
export interface SharedProductCreateDto {
    productId: string;
    channel: string;
}

// Review related types
export interface ReviewCreateDto {
    productId: string;
    rating: number;
    comment?: string;
}

export interface ReviewUpdateDto {
    rating: number;
    comment?: string;
}

// Tag related types
export interface ProductTagCreateDto {
    tagId: string;
}

// Error response types
export interface ErrorResponse {
    code: number;
    message: string;
}

// Pagination related types - Fix: Properly extend Request
export interface PaginatedRequest extends Request {
    pagination?: {
        limit: number;
        offset: number;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        limit: number;
        offset: number;
    }
}

// Message response
export interface MessageResponse {
    message: string;
}

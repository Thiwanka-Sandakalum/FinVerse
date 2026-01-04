/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductDetails = {
    /**
     * Unique product identifier
     */
    id?: string;
    /**
     * Product name
     */
    name?: string;
    /**
     * Category identifier
     */
    categoryId?: string;
    /**
     * Flexible JSON object containing product-specific details
     */
    details?: Record<string, any>;
    /**
     * Whether the product is featured
     */
    isFeatured?: boolean;
    /**
     * Whether the product is currently active
     */
    isActive?: boolean;
    /**
     * Timestamp when the product was created
     */
    createdAt?: string;
    /**
     * Timestamp when the product was last updated
     */
    updatedAt?: string;
};


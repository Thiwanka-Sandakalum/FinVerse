/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Product = {
    /**
     * Unique product identifier
     */
    id?: string;
    /**
     * Product name
     */
    name?: string;
    /**
     * Product type
     */
    type?: string;
    /**
     * Associated financial institution ID
     */
    institution_id?: string;
    /**
     * Associated financial institution name
     */
    institution_name?: string;
    /**
     * Product description
     */
    description?: string;
    /**
     * Product-specific features and attributes
     */
    features?: Record<string, any>;
    /**
     * Product creation timestamp
     */
    created_at?: string;
    /**
     * Last update timestamp
     */
    updated_at?: string;
};


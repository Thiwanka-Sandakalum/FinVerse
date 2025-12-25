/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductComparisonRequest = {
    /**
     * List of product IDs to compare (minimum 2 required)
     */
    product_ids: Array<string>;
    /**
     * Optional conversation ID to maintain chat context
     */
    conversation_id?: string | null;
};


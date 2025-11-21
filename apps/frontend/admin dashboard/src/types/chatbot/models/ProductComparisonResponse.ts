/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Product } from './Product';
export type ProductComparisonResponse = {
    /**
     * AI-generated summary of the product comparison
     */
    summary: string;
    /**
     * Detailed comparison data structure
     */
    comparison: Record<string, any>;
    /**
     * List of compared products with their details
     */
    products: Array<Product>;
    /**
     * Conversation identifier
     */
    conversation_id: string;
};


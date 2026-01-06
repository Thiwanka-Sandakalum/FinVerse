/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductDetails } from './ProductDetails';
export type ComparisonResponse = {
    success: boolean;
    message: string;
    data: {
        /**
         * Array of product details being compared
         */
        products: Array<ProductDetails>;
        /**
         * AI-generated comparison summary
         */
        summary: string;
    };
    meta: {
        timestamp?: string;
    };
};


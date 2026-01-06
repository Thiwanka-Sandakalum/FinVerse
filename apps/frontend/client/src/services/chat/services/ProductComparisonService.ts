/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompareRequest } from '../models/CompareRequest';
import type { ComparisonResponse } from '../models/ComparisonResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductComparisonService {
    /**
     * Compare products
     * Compare multiple financial products side-by-side. The system:
     * 1. Fetches details for all specified products
     * 2. Uses LLM to generate comprehensive comparison
     * 3. Returns product details and AI-generated comparison summary
     *
     * @param requestBody
     * @returns ComparisonResponse Successful comparison
     * @throws ApiError
     */
    public static compareProducts(
        requestBody: CompareRequest,
    ): CancelablePromise<ComparisonResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/compare-products',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `One or more products not found`,
                422: `Validation error`,
                500: `Internal server error`,
            },
        });
    }
}

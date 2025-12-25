/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductComparisonRequest } from '../models/ProductComparisonRequest';
import type { ProductComparisonResponse } from '../models/ProductComparisonResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductComparisonService {
    /**
     * Compare multiple financial products
     * Compare multiple financial products by their IDs.
     * Returns a structured comparison highlighting differences across key attributes.
     * Requires at least 2 product IDs.
     *
     * @param requestBody
     * @returns ProductComparisonResponse Product comparison response
     * @throws ApiError
     */
    public static postCompareProducts(
        requestBody: ProductComparisonRequest,
    ): CancelablePromise<ProductComparisonResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/compare-products',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (less than 2 products provided)`,
                500: `Internal server error`,
            },
        });
    }
}

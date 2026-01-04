/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { APIResponse } from '../models/APIResponse';
import type { ProductChatRequest } from '../models/ProductChatRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductChatService {
    /**
     * Product-specific chat
     * Chat about a specific financial product. The system:
     * 1. Fetches the product details by ID
     * 2. Uses LLM with product-specific context
     * 3. Generates accurate responses based on actual product information
     *
     * @param xUserId Unique identifier for the user
     * @param requestBody
     * @returns APIResponse Successful response
     * @throws ApiError
     */
    public static productChat(

        requestBody: ProductChatRequest,
    ): CancelablePromise<APIResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product-chat',
            headers: {

            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Product not found`,
                422: `Validation error`,
                500: `Internal server error`,
            },
        });
    }
}

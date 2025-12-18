/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatResponse } from '../models/ChatResponse';
import type { ProductChatRequest } from '../models/ProductChatRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductChatService {
    /**
     * Chat about a specific financial product
     * Process queries about a specific financial product identified by its ID.
     * All responses are contextualized to the specific product.
     *
     * @param requestBody
     * @returns ChatResponse Product-specific chat response
     * @throws ApiError
     */
    public static postProductChat(
        requestBody: ProductChatRequest,
    ): CancelablePromise<ChatResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product-chat',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Product not found`,
                500: `Internal server error`,
            },
        });
    }
}

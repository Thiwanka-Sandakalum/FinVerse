/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { APIResponse } from '../models/APIResponse';
import type { ChatRequest } from '../models/ChatRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * General chat
     * Handle general chat messages about financial products. The system uses LLM to:
     * 1. Analyze the user's message
     * 2. Generate SQL queries to find relevant products
     * 3. Fetch related products from the database
     * 4. Generate intelligent responses with context
     *
     * @param xUserId Unique identifier for the user
     * @param requestBody
     * @returns APIResponse Successful response
     * @throws ApiError
     */
    public static chat(

        requestBody: ChatRequest,
    ): CancelablePromise<APIResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat',
            headers: {

            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                422: `Validation error`,
                500: `Internal server error`,
            },
        });
    }
}

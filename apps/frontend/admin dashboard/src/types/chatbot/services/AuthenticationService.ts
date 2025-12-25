/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Get current user information
     * Get information about the currently authenticated user.
     * Requires a valid JWT token in the Authorization header.
     *
     * @returns UserResponse Current user information
     * @throws ApiError
     */
    public static getAuthMe(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
                500: `Internal server error`,
            },
        });
    }
}

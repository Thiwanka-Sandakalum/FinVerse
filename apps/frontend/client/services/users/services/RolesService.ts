/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiSuccessResponse } from '../models/ApiSuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RolesService {
    /**
     * List roles
     * Get list of all available roles
     * @param xRequestId Optional request ID for distributed tracing
     * @param page Page number (0-indexed)
     * @param perPage Items per page
     * @returns any Roles retrieved successfully
     * @throws ApiError
     */
    public static listRoles(

        page?: number,
        perPage: number = 50,
    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/roles',
            headers: {

            },
            query: {
                'page': page,
                'per_page': perPage,
            },
            errors: {
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                500: `Internal server error`,
            },
        });
    }
}

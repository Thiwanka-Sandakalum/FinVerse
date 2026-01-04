/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiSuccessResponse } from '../models/ApiSuccessResponse';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * List users
     * Get paginated list of all users (requires super_admin role)
     * @param xRequestId Optional request ID for distributed tracing
     * @param page Page number (0-indexed)
     * @param perPage Items per page
     * @returns any Users retrieved successfully
     * @throws ApiError
     */
    public static listUsers(

        page?: number,
        perPage: number = 50,
    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
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
    /**
     * Get user by ID
     * @param id User identifier (Auth0 user ID)
     * @param xRequestId Optional request ID for distributed tracing
     * @returns User User details
     * @throws ApiError
     */
    public static getUserById(
        id: string,

    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            headers: {

            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Update user
     * @param id User identifier (Auth0 user ID)
     * @param requestBody
     * @param xRequestId Optional request ID for distributed tracing
     * @returns User User updated
     * @throws ApiError
     */
    public static updateUser(
        id: string,
        requestBody: User,

    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            headers: {

            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Delete user
     * @param id User identifier (Auth0 user ID)
     * @param xRequestId Optional request ID for distributed tracing
     * @returns ApiSuccessResponse User deleted
     * @throws ApiError
     */
    public static deleteUser(
        id: string,

    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            headers: {

            },
            errors: {
                404: `User not found`,
            },
        });
    }
}

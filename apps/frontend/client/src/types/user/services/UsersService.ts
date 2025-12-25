/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Pagination } from '../models/Pagination';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * List all users in the system
     * List users (paginated). Access: super_admin (user:read).
     * @param organizationId Filter users by organization ID
     * @param page
     * @param limit
     * @returns any Paginated users
     * @throws ApiError
     */
    public static getUsers(
        organizationId?: string,
        page: number = 1,
        limit: number = 25,
    ): CancelablePromise<{
        pagination?: Pagination;
        items?: Array<User>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
            query: {
                'organizationId': organizationId,
                'page': page,
                'limit': limit,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get specific user (cross-org)
     * Access: super_admin (user:read).
     * @param userId
     * @returns User User details
     * @throws ApiError
     */
    public static getUsers1(
        userId: string,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Deactivate or delete user
     * Deactivate or delete user. Access: super_admin (admin:manage).
     * @param userId
     * @returns void
     * @throws ApiError
     */
    public static deleteUsers(
        userId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Update user details
     * Update user information. Access: super_admin (user:write).
     * @param userId
     * @param requestBody
     * @returns User User updated successfully
     * @throws ApiError
     */
    public static putUsers(
        userId: string,
        requestBody: {
            email?: string;
            name?: string;
            picture?: string;
            metadata?: Record<string, any>;
        },
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{userId}',
            path: {
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
}

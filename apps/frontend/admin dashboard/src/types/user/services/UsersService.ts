/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginCallbackRequest } from '../models/LoginCallbackRequest';
import type { LoginCallbackResponse } from '../models/LoginCallbackResponse';
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
     * List all users with enhanced organization data
     * List users with enhanced organization information including organization details
     * and role information. Returns users with their associated organization data.
     * Access: super_admin (user:read).
     *
     * @param organizationId Filter users by organization ID
     * @param page
     * @param limit
     * @returns any Paginated enhanced users with organization data
     * @throws ApiError
     */
    public static getUsersEnhanced(
        organizationId?: string,
        page: number = 1,
        limit: number = 25,
    ): CancelablePromise<{
        start?: number;
        limit?: number;
        length?: number;
        total?: number;
        users?: Array<{
            user_id?: string;
            email?: string;
            name?: string;
            picture?: string;
            email_verified?: boolean;
            last_login?: string;
            app_metadata?: {
                role?: 'super_admin' | 'org_admin' | 'member';
                org_id?: string;
                permissions?: Array<string>;
            };
            organization?: {
                id?: string;
                name?: string;
                display_name?: string;
            };
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/enhanced',
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
     * Handle Auth0 login callback
     * Process Auth0 login callback with JWT token verification, automatic organization creation,
     * and role assignment. This endpoint creates organizations based on email domains and assigns
     * appropriate roles to users. Access: Authenticated users with valid JWT token.
     *
     * @param requestBody
     * @returns LoginCallbackResponse Login callback processed successfully
     * @throws ApiError
     */
    public static postUsersLoginCallback(
        requestBody: LoginCallbackRequest,
    ): CancelablePromise<LoginCallbackResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/login-callback',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - missing or invalid token`,
                401: `Unauthorized - invalid JWT token`,
                500: `Internal server error - Auth0 API or processing error`,
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

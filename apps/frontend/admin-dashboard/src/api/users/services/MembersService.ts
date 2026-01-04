/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiSuccessResponse } from '../models/ApiSuccessResponse';
import type { Role } from '../models/Role';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MembersService {
    /**
     * List organization members
     * Get all members of an organization
     * @param orgId Organization identifier
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Members retrieved successfully
     * @throws ApiError
     */
    public static getOrganizationMembers(
        orgId: string,
        xRequestId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{orgId}/members',
            path: {
                'orgId': orgId,
            },
            headers: {
                'X-Request-ID': xRequestId,
            },
            errors: {
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Remove organization members
     * Remove members from an organization
     * @param orgId Organization identifier
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Members removed successfully
     * @throws ApiError
     */
    public static deleteOrganizationMembers(
        orgId: string,
        xRequestId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{orgId}/members',
            path: {
                'orgId': orgId,
            },
            headers: {
                'X-Request-ID': xRequestId,
            },
            errors: {
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get organization member roles
     * @param orgId Organization identifier
     * @param userId User identifier (Auth0 user ID)
     * @param xRequestId Optional request ID for distributed tracing
     * @returns Role List of roles for the member
     * @throws ApiError
     */
    public static getOrganizationMemberRoles(
        orgId: string,
        userId: string,
        xRequestId?: string,
    ): CancelablePromise<Array<Role>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{orgId}/members/{userId}/roles',
            path: {
                'orgId': orgId,
                'userId': userId,
            },
            headers: {
                'X-Request-ID': xRequestId,
            },
            errors: {
                404: `Member not found`,
            },
        });
    }
    /**
     * Assign organization member roles
     * @param orgId Organization identifier
     * @param userId User identifier (Auth0 user ID)
     * @param requestBody
     * @param xRequestId Optional request ID for distributed tracing
     * @returns ApiSuccessResponse Roles assigned
     * @throws ApiError
     */
    public static assignOrganizationMemberRoles(
        orgId: string,
        userId: string,
        requestBody: {
            roles?: Array<string>;
        },
        xRequestId?: string,
    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{orgId}/members/{userId}/roles',
            path: {
                'orgId': orgId,
                'userId': userId,
            },
            headers: {
                'X-Request-ID': xRequestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Member not found`,
            },
        });
    }
}

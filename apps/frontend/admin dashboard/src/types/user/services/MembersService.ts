/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Member } from '../models/Member';
import type { Pagination } from '../models/Pagination';
import type { Role } from '../models/Role';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MembersService {
    /**
     * List all members of an organization
     * List organization members (paginated). Access: org_admin (permission: org:read).
     * @param orgId
     * @param page
     * @param limit
     * @returns any Paginated members list
     * @throws ApiError
     */
    public static getOrgsMembers(
        orgId: string,
        page: number = 1,
        limit: number = 25,
    ): CancelablePromise<{
        pagination?: Pagination;
        items?: Array<Member>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{orgId}/members',
            path: {
                'orgId': orgId,
            },
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Remove members from organization
     * Remove members. Access: org_admin, super_admin (org:write).
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static deleteOrgsMembers(
        requestBody: {
            /**
             * Array of user IDs to remove
             */
            members: Array<string>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{orgId}/members',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get roles assigned to a member
     * Get roles assigned to a member within an organization. Access: org_admin (org:read).
     * @param orgId
     * @param userId
     * @param page
     * @param perPage
     * @returns any List of roles assigned to member
     * @throws ApiError
     */
    public static getOrgsMembersRoles(
        orgId: string,
        userId: string,
        page: number = 1,
        perPage: number = 25,
    ): CancelablePromise<{
        start?: number;
        limit?: number;
        total?: number;
        roles?: Array<Role>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{orgId}/members/{userId}/roles',
            path: {
                'orgId': orgId,
                'userId': userId,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
            errors: {
                400: `Bad request`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Assign roles to a member
     * Assign roles to a member within an organization. Access: org_admin (org:write).
     * @param orgId
     * @param userId
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static postOrgsMembersRoles(
        orgId: string,
        userId: string,
        requestBody: {
            /**
             * Array of role IDs to assign
             */
            roles: Array<string>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{orgId}/members/{userId}/roles',
            path: {
                'orgId': orgId,
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

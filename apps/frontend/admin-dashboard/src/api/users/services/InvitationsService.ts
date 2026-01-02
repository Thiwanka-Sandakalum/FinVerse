/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiSuccessResponse } from '../models/ApiSuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvitationsService {
    /**
     * Create invitation
     * Invite new user to organization via email
     * @param orgId Organization identifier
     * @param requestBody
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Invitation created successfully
     * @throws ApiError
     */
    public static createOrganizationInvitation(
        orgId: string,
        requestBody: {
            inviter: {
                name: string;
            };
            invitee: {
                email: string;
            };
            roles: Array<string>;
        },
        xRequestId?: string,
    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{orgId}/invitations',
            path: {
                'orgId': orgId,
            },
            headers: {
                'X-Request-ID': xRequestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - validation error`,
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * List invitations
     * Get paginated list of pending invitations for organization
     * @param orgId Organization identifier
     * @param xRequestId Optional request ID for distributed tracing
     * @param page Page number (0-indexed)
     * @param perPage Items per page
     * @returns any Invitations retrieved successfully
     * @throws ApiError
     */
    public static listOrganizationInvitations(
        orgId: string,
        xRequestId?: string,
        page?: number,
        perPage: number = 50,
    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{orgId}/invitations',
            path: {
                'orgId': orgId,
            },
            headers: {
                'X-Request-ID': xRequestId,
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
     * Delete invitation
     * Delete a pending invitation
     * @param orgId Organization identifier
     * @param invitationId Invitation identifier
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Invitation deleted successfully
     * @throws ApiError
     */
    public static deleteOrganizationInvitation(
        orgId: string,
        invitationId: string,
        xRequestId?: string,
    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{orgId}/invitations/{invitationId}',
            path: {
                'orgId': orgId,
                'invitationId': invitationId,
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
}

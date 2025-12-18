/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationInvitation } from '../models/OrganizationInvitation';
import type { Pagination } from '../models/Pagination';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvitationsService {
    /**
     * Invite a new user via email
     * Send an invitation email (Auth0 or app-managed invite link). Access: org_admin (invite:manage).
     *
     * @param orgId
     * @param requestBody
     * @returns OrganizationInvitation Invitation created
     * @throws ApiError
     */
    public static postOrgsInvitations(
        orgId: string,
        requestBody: {
            inviter?: {
                name: string;
            };
            invitee?: {
                email: string;
            };
            user_metadata?: Record<string, any>;
            roles?: Array<string>;
        },
    ): CancelablePromise<OrganizationInvitation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{orgId}/invitations',
            path: {
                'orgId': orgId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
            },
        });
    }
    /**
     * List pending invitations for an org
     * List pending invitations for an organization (paginated). Access: org_admin (invite:manage).
     * @param orgId
     * @param page
     * @param limit
     * @returns any Paginated list of invitations
     * @throws ApiError
     */
    public static getOrgsInvitations(
        orgId: string,
        page: number = 1,
        limit: number = 25,
    ): CancelablePromise<{
        pagination?: Pagination;
        items?: Array<OrganizationInvitation>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{orgId}/invitations',
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
     * Delete an invitation
     * Delete a pending invitation. Access: org_admin (invite:manage).
     * @param orgId
     * @param invitationId
     * @returns void
     * @throws ApiError
     */
    public static deleteOrgsInvitations(
        orgId: string,
        invitationId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{orgId}/invitations/{invitationId}',
            path: {
                'orgId': orgId,
                'invitationId': invitationId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
}

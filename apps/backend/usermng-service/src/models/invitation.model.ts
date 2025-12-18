/**
 * Invitation Model
 * Handles all Auth0 API interactions for organization invitations
 */

import { config } from '../config/env';
import { getAuth0AccessToken } from '../utils/auth0';
import {
    OrganizationInvitation,
    OrganizationInvitationListResponse,
    CreateInvitationPayload,
} from '../types/invitation.types';

/**
 * Create an invitation to an organization
 */
export async function createOrganizationInvitation(
    orgId: string,
    payload: CreateInvitationPayload
): Promise<OrganizationInvitation> {
    if (!orgId) throw new Error('Organization ID is required');
    if (!payload) throw new Error('Invitation payload is required');

    const token = await getAuth0AccessToken();
    const url = `${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/invitations`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Auth0 create org invitation failed: ${response.status} ${response.statusText} - ${error}`);
    }

    return await response.json() as OrganizationInvitation;
}

/**
 * Get invitations to an organization
 */
export async function getOrganizationInvitations(
    orgId: string,
    params: {
        page?: number;
        per_page?: number;
        include_totals?: boolean;
        fields?: string;
        include_fields?: boolean;
        sort?: string;
    } = {}
): Promise<OrganizationInvitationListResponse | OrganizationInvitation[]> {
    if (!orgId) throw new Error('Organization ID is required');

    const token = await getAuth0AccessToken();
    const url = new URL(`${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/invitations`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.append(key, String(value));
    });

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Auth0 get org invitations failed: ${response.status} ${response.statusText} - ${error}`);
    }

    return await response.json() as OrganizationInvitationListResponse | OrganizationInvitation[];
}

/**
 * Delete an invitation from an organization
 */
export async function deleteOrganizationInvitation(
    orgId: string,
    invitationId: string
): Promise<void> {
    if (!orgId) throw new Error('Organization ID is required');
    if (!invitationId) throw new Error('Invitation ID is required');

    const token = await getAuth0AccessToken();
    const url = `${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/invitations/${encodeURIComponent(invitationId)}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Auth0 delete org invitation failed: ${response.status} ${response.statusText} - ${error}`);
    }
}

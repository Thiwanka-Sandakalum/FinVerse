/**
 * Delete an invitation from an organization in Auth0
 * @param orgId Organization ID
 * @param invitationId Invitation ID
 */
export async function deleteOrganizationInvitation(
    orgId: string,
    invitationId: string
): Promise<void> {
    if (!orgId) throw new Error('Organization ID is required');
    if (!invitationId) throw new Error('Invitation ID is required');
    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/invitations/${encodeURIComponent(invitationId)}`;
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
    // 204 No Content on success
}
export interface OrganizationInvitation {
    id: string;
    organization_id: string;
    inviter: { name: string };
    invitee: { email: string };
    invitation_url: string;
    created_at: string;
    expires_at: string;
    client_id: string;
    connection_id?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
    roles?: string[];
    ticket_id?: string;
}

export interface OrganizationInvitationListResponse {
    start?: number;
    limit?: number;
    invitations: OrganizationInvitation[];
}

/**
 * Get invitations to an organization in Auth0
 * @param orgId Organization ID
 * @param params Query parameters for pagination, fields, and sorting
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
    const url = new URL(`${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/invitations`);
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
import { getAuth0AccessToken } from '../../utils/auth0';
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';

export interface CreateInvitationPayload {
    inviter: { name: string };
    invitee: { email: string };
    client_id?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
    roles?: string[];
    send_invitation_email?: boolean;
}

/**
 * Create an invitation to an organization in Auth0
 * @param orgId Organization ID
 * @param payload Invitation payload
 */
export async function createOrganizationInvitation(
    orgId: string,
    payload: CreateInvitationPayload
): Promise<any> {
    if (!orgId) throw new Error('Organization ID is required');
    if (!payload) throw new Error('Invitation payload is required');
    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/invitations`;
    // Always set client_id from env, ignore payload.client_id
    const clientId = process.env.INVITATION_CLIENT_ID;
    const invitationPayload = {
        ...payload,
        client_id: clientId,
    };

    console.log('Creating invitation with payload:', invitationPayload);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitationPayload),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Auth0 create org invitation failed: ${response.status} ${response.statusText} - ${error}`);
    }
    return response.json();
}

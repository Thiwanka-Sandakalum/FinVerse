/**
 * Assign one or more roles to a user for a specific organization
 * @param orgId Organization ID
 * @param userId User ID
 * @param roles Array of role IDs to assign
 */
export async function assignOrganizationMemberRoles(
    orgId: string,
    userId: string,
    roles: string[]
): Promise<void> {
    if (!orgId) throw new Error('Organization ID is required');
    if (!userId) throw new Error('User ID is required');
    if (!Array.isArray(roles) || roles.length === 0) throw new Error('Roles array is required');
    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}/roles`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roles }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        // Pass status and message to error handler via custom error object
        const err: any = new Error(`Auth0 assign org member roles failed: ${response.status} ${response.statusText} - ${errorText}`);
        err.status = response.status;
        throw err;
    }
    // 204 No Content on success
}
import { getAuth0AccessToken } from '../../utils/auth0';
import {
    OrganizationMember,
    OrganizationMemberRole,
    OrganizationMemberListResponse,
    OrganizationMemberRolesResponse,
} from './member.types';
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';

/**
 * Get members who belong to an organization (with pagination and field selection)
 * @param orgId Organization ID
 * @param params Query parameters for pagination and fields
 */
interface Auth0MemberResponse {
    members: OrganizationMember[];
    total: number;
}

export async function getOrganizationMembers(
    orgId: string,
    params: {
        page?: number;
        per_page?: number;
        include_totals?: boolean;
        from?: string;
        take?: number;
        fields?: string;
        include_fields?: boolean;
    } = {}
): Promise<OrganizationMemberListResponse> {
    if (!orgId) throw new Error('Organization ID is required');
    const token = await getAuth0AccessToken();
    const url = new URL(`${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members`);

    // Ensure pagination parameters
    const page = params.page || 0;
    const limit = params.per_page || 25;
    url.searchParams.append('page', String(page));
    url.searchParams.append('per_page', String(limit));
    url.searchParams.append('include_totals', 'true');

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && !['page', 'per_page'].includes(key)) {
            url.searchParams.append(key, String(value));
        }
    });

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        const err: any = new Error(`Auth0 get org members failed: ${response.status} ${response.statusText} - ${errorText}`);
        err.status = response.status;
        throw err;
    }

    const data = await response.json() as Auth0MemberResponse;
    console.log(data);
    return {
        items: data.members,
        pagination: {
            page,
            limit,
            total: data.total
        }
    };
}

/**
 * Delete members from an organization in Auth0
 * @param orgId Organization ID
 * @param members Array of user IDs to remove
 */
export async function deleteOrganizationMembers(orgId: string, members: string[]): Promise<void> {
    if (!orgId) throw new Error('Organization ID is required');
    if (!Array.isArray(members) || members.length === 0) throw new Error('Members array is required');
    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        const err: any = new Error(`Auth0 delete org members failed: ${response.status} ${response.statusText} - ${errorText}`);
        err.status = response.status;
        throw err;
    }
    // 204 No Content on success
}

/**
 * Get roles assigned to a user within an organization
 * @param orgId Organization ID
 * @param userId User ID
 * @param params Optional pagination params
 */
interface Auth0RolesResponse {
    roles: OrganizationMemberRole[];
    total: number;
}

export async function getOrganizationMemberRoles(
    orgId: string,
    userId: string,
    params: {
        page?: number;
        per_page?: number;
        include_totals?: boolean;
    } = {}
): Promise<OrganizationMemberRolesResponse> {
    if (!orgId) throw new Error('Organization ID is required');
    if (!userId) throw new Error('User ID is required');
    const token = await getAuth0AccessToken();
    const url = new URL(`${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}/roles`);

    // Ensure pagination parameters
    const page = params.page || 0;
    const limit = params.per_page || 25;
    url.searchParams.append('page', String(page));
    url.searchParams.append('per_page', String(limit));
    url.searchParams.append('include_totals', 'true');

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && !['page', 'per_page'].includes(key)) {
            url.searchParams.append(key, String(value));
        }
    });

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        const err: any = new Error(`Auth0 get org member roles failed: ${response.status} ${response.statusText} - ${errorText}`);
        err.status = response.status;
        throw err;
    }

    const data = await response.json() as Auth0RolesResponse;
    return {
        items: data.roles,
        pagination: {
            page,
            limit,
            total: data.total
        }
    };
}

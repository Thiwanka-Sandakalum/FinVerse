/**
 * Member Model
 * Handles all Auth0 API interactions for organization members
 */

import { config } from '../config/env';
import { getAuth0AccessToken } from '../utils/auth0';
import {
    OrganizationMember,
    OrganizationMemberRole,
    OrganizationMemberListResponse,
    OrganizationMemberRolesResponse,
} from '../types/member.types';

interface Auth0MemberResponse {
    members: OrganizationMember[];
    total: number;
}

interface Auth0RolesResponse {
    roles: OrganizationMemberRole[];
    total: number;
}

/**
 * Get members who belong to an organization
 */
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
    const url = new URL(`${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members`);

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
 * Delete members from an organization
 */
export async function deleteOrganizationMembers(orgId: string, members: string[]): Promise<void> {
    if (!orgId) throw new Error('Organization ID is required');
    if (!Array.isArray(members) || members.length === 0) throw new Error('Members array is required');

    const token = await getAuth0AccessToken();
    const url = `${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members`;

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
}

/**
 * Get roles assigned to a user within an organization
 */
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
    const url = new URL(`${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}/roles`);

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

/**
 * Assign roles to a user for a specific organization
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
    const url = `${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}/roles`;

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
        const err: any = new Error(`Auth0 assign org member roles failed: ${response.status} ${response.statusText} - ${errorText}`);
        err.status = response.status;
        throw err;
    }
}

/**
 * Organization Model
 * Handles all Auth0 API interactions for organizations
 */

import { config } from '../config/env';
import { getAuth0AccessToken } from '../utils/auth0';
import { handleAuth0Error } from '../utils/errors';
import {
    Organization,
    OrganizationCreateRequest,
} from '../types/organization.types';
import { PaginatedResponse, SingleItemResponse } from '../interfaces/response';

/**
 * Create a new organization in Auth0
 */
export async function createOrganization(orgData: OrganizationCreateRequest): Promise<Organization> {
    const token = await getAuth0AccessToken();
    const response = await fetch(`${config.AUTH0_DOMAIN}/api/v2/organizations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orgData),
    });

    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status);
    }

    return await response.json() as Organization;
}

/**
 * Update an organization in Auth0
 */
export async function updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization> {
    if (!id) throw new Error('Organization ID is required');

    const token = await getAuth0AccessToken();
    const response = await fetch(`${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status, id);
    }

    return await response.json() as Organization;
}

/**
 * Delete an organization from Auth0
 */
export async function deleteOrganization(id: string): Promise<void> {
    if (!id) throw new Error('Organization ID is required');

    const token = await getAuth0AccessToken();
    const response = await fetch(`${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status, id);
    }
}

/**
 * Get a single organization by ID from Auth0
 */
export async function getOrganizationById(id: string): Promise<Organization> {
    if (!id) throw new Error('Organization ID is required');

    const token = await getAuth0AccessToken();
    const response = await fetch(`${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status, id);
    }

    return await response.json() as Organization;
}

/**
 * Get a list of organizations from Auth0
 */
export async function getOrganizations(params: {
    page?: number;
    per_page?: number;
    include_totals?: boolean;
    from?: string;
    take?: number;
    sort?: string;
} = {}): Promise<PaginatedResponse<Organization>> {
    const token = await getAuth0AccessToken();
    const url = new URL(`${config.AUTH0_DOMAIN}/api/v2/organizations`);

    const page = params.page || 0;
    const limit = params.per_page || 25;
    url.searchParams.append('page', String(page));
    url.searchParams.append('per_page', String(limit));
    url.searchParams.append('include_totals', 'true');

    if (params.sort) url.searchParams.append('sort', params.sort);
    if (params.from) url.searchParams.append('from', params.from);
    if (params.take) url.searchParams.append('take', String(params.take));

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status);
    }

    const auth0Response = await response.json() as { organizations: Organization[]; total: number };

    return {
        pagination: {
            page,
            limit,
            total: auth0Response.total || 0
        },
        items: auth0Response.organizations || []
    };
}

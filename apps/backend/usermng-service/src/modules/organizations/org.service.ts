/**
 * Update an organization in Auth0 by ID
 * @param id Organization ID
 * @param updates Partial organization fields to update
 * @returns Updated organization object
 */
export async function updateOrganization(id: string, updates: Partial<Organization>): Promise<SingleItemResponse<Organization>> {
    if (!id) throw new Error('Organization ID is required');
    if (!updates || typeof updates !== 'object') throw new Error('Updates object is required');
    console.log('Updates received for organization:', updates);
    const allowedUpdates: OrganizationUpdateRequest = {};

    // Validate and copy allowed fields
    if ('name' in updates && updates.name !== undefined) {
        if (typeof updates.name !== 'string') {
            throw new Error('Name must be a string');
        }
        if (updates.name.length < 1 || updates.name.length > 50) {
            throw new Error('Organization name must be between 1 and 50 characters');
        }
        // Stricter name format: only letters, numbers, and hyphens, must start with letter/number
        const nameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/;
        if (!nameRegex.test(updates.name)) {
            throw new Error('Organization name can only contain letters, numbers, and hyphens. It must start and end with a letter or number.');
        }
        allowedUpdates.name = updates.name;
    }

    if ('metadata' in updates && updates.metadata !== undefined) {
        if (typeof updates.metadata !== 'object' || updates.metadata === null) {
            throw new Error('Metadata must be an object');
        }
        allowedUpdates.metadata = updates.metadata;
    }

    // Ensure at least one valid field is being updated
    if (Object.keys(allowedUpdates).length === 0) {
        throw new Error('At least one valid field (name or metadata) must be provided for update');
    }

    const token = await getAuth0AccessToken();
    const response = await fetch(`${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(allowedUpdates),
    });

    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status, id);
    }

    const data = await response.json() as Organization;
    return { data };
}
/**
 * Delete an organization from Auth0 by ID
 * @param id Organization ID
 * @returns void if successful
 */
export async function deleteOrganization(id: string): Promise<void> {
    if (!id) throw new Error('Organization ID is required');
    const token = await getAuth0AccessToken();
    const response = await fetch(`${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status, id);
    }
    // 204 No Content on success
}
/**
 * Retrieve details about a single organization by ID from Auth0
 * @param id Organization ID
 * @returns Organization details
 */
export async function getOrganizationById(id: string): Promise<SingleItemResponse<Organization>> {
    if (!id) throw new Error('Organization ID is required');
    const token = await getAuth0AccessToken();
    const response = await fetch(`${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status, id);
    }
    const data = await response.json() as Organization;
    return { data };
}
/**
 * Retrieve a list of organizations from Auth0
 * Supports offset and checkpoint pagination
 * @param params Query parameters for pagination and filtering
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
    const url = new URL(`${AUTH0_DOMAIN}/api/v2/organizations`);

    // Ensure pagination parameters
    const page = params.page || 0;
    const limit = params.per_page || 25;
    url.searchParams.append('page', String(page));
    url.searchParams.append('per_page', String(limit));
    url.searchParams.append('include_totals', 'true');

    // Add other parameters if provided
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
    console.log(auth0Response);
    // Transform to our standard response format
    return {
        pagination: {
            page,
            limit,
            total: auth0Response.total || 0
        },
        items: auth0Response.organizations || []
    };
}
import { OrganizationCreateRequest, Organization } from './org.types';
import { getAuth0AccessToken } from '../../utils/auth0';
import { PaginatedResponse, SingleItemResponse } from '../../interfaces/response';
import { handleAuth0Error } from '../../utils/errors';
import path from 'path';
import fs from 'fs';

interface OrganizationUpdateRequest {
    name?: string;
    metadata?: Record<string, any>;
}

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

/**
 * Create a new organization in Auth0
 * @param org Organization creation payload
 * @returns The created organization object
 */
export async function createOrganization(org: OrganizationCreateRequest): Promise<Organization> {
    const token = await getAuth0AccessToken();
    // Load enabled_connections from config file
    const configPath = path.resolve(__dirname, '../../config/organizationConnections.json');
    let enabledConnections: any[] = [];
    try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        enabledConnections = JSON.parse(raw);
    } catch (err) {
        // fallback to empty array if config missing or invalid
        enabledConnections = [];
    }
    const orgPayload = {
        ...org,
        enabled_connections: enabledConnections.length > 0 ? enabledConnections : undefined,
    };
    const response: any = await fetch(`${AUTH0_DOMAIN}/api/v2/organizations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orgPayload),
    });
    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status);
    }
    return response.json() as Organization;
}

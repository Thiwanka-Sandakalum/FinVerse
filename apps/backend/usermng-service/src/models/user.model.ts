/**
 * User Model
 * Handles all Auth0 API interactions for users
 */

import { config } from '../config/env';
import { getAuth0AccessToken } from '../utils/auth0';
import { handleAuth0Error } from '../utils/errors';
import {
    Auth0User,
    Auth0UserListResponse,
    AllowedUserUpdates,
} from '../types/user.types';
import { Organization } from '../types/organization.types';

/**
 * Delete a user by ID from Auth0
 */
export async function deleteUser(id: string): Promise<void> {
    if (!id) throw new Error('User ID is required');

    const token = await getAuth0AccessToken();
    const url = `${config.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
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
 * Update a user by ID in Auth0
 */
export async function updateUser(id: string, updates: AllowedUserUpdates): Promise<Auth0User> {
    if (!id) throw new Error('User ID is required');

    const token = await getAuth0AccessToken();
    const url = `${config.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
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

    return await response.json() as Auth0User;
}

/**
 * Get a user by ID from Auth0
 */
export async function getUserById(
    id: string,
    params: {
        fields?: string;
        include_fields?: boolean;
    } = {}
): Promise<Auth0User> {
    if (!id) throw new Error('User ID is required');

    const token = await getAuth0AccessToken();
    const url = new URL(`${config.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`);

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
        handleAuth0Error(error, response.status, id);
    }

    return await response.json() as Auth0User;
}

/**
 * List or search users in Auth0
 */
export async function getUsers(params: {
    page?: number;
    per_page?: number;
    include_totals?: boolean;
    sort?: string;
    connection?: string;
    fields?: string;
    include_fields?: boolean;
    q?: string;
    search_engine?: string;
    primary_order?: boolean;
} = {}): Promise<Auth0UserListResponse | Auth0User[]> {
    const token = await getAuth0AccessToken();
    const url = new URL(`${config.AUTH0_DOMAIN}/api/v2/users`);

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
        handleAuth0Error(error, response.status);
    }

    return await response.json() as Auth0UserListResponse | Auth0User[];
}

/**
 * Update user app_metadata in Auth0
 */
export async function updateUserMetadata(userId: string, metadata: Record<string, any>): Promise<Auth0User> {
    const token = await getAuth0AccessToken();
    const url = `${config.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`;

    const updatePayload = {
        app_metadata: metadata
    };

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status, userId);
    }

    return await response.json() as Auth0User;
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(orgId: string): Promise<Organization> {
    const token = await getAuth0AccessToken();
    const response = await fetch(`${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        handleAuth0Error(error, response.status, orgId);
    }

    return await response.json() as Organization;
}

/**
 * Add user to organization as a member
 */
export async function addUserToOrganization(orgId: string, userId: string): Promise<void> {
    const token = await getAuth0AccessToken();
    const url = `${config.AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members`;

    const body = {
        members: [userId]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to add user to organization: ${response.status} ${response.statusText} - ${error}`);
    }
}

/**
 * Assign user to role
 */
export async function assignUserToRole(roleId: string, userId: string): Promise<void> {
    const token = await getAuth0AccessToken();
    const url = `${config.AUTH0_DOMAIN}/api/v2/roles/${encodeURIComponent(roleId)}/users`;

    const body = {
        users: [userId]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to assign user to role: ${response.status} ${response.statusText} - ${error}`);
    }
}

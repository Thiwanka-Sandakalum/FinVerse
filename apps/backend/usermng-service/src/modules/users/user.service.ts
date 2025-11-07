/**
 * Delete a user by ID from Auth0
 * @param id User ID
 */
export async function deleteUser(id: string): Promise<void> {
    if (!id) throw new Error('User ID is required');
    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`;
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
    // 204 No Content on success
}

/**
 * Update a user by ID in Auth0
 * @param id User ID
 * @param updates Partial user fields to update
 */
interface AllowedUserUpdates {
    name?: string;
    user_metadata?: Record<string, any>;
    picture?: string;
}

export async function updateUser(
    id: string,
    updates: any
): Promise<Auth0User> {
    if (!id) throw new Error('User ID is required');
    if (!updates || typeof updates !== 'object') throw new Error('Updates object is required');

    // Only allow specific fields to be updated
    const { name, metadata, picture } = updates;
    const allowedUpdates: AllowedUserUpdates = {};

    if (name !== undefined) allowedUpdates.name = name;
    if (metadata !== undefined) allowedUpdates.user_metadata = metadata;
    if (picture !== undefined) allowedUpdates.picture = picture;

    // Throw error if no allowed fields are being updated
    if (Object.keys(allowedUpdates).length === 0) {
        throw new Error('At least one valid field (name, user_metadata, or picture) must be provided for update');
    }

    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
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
    const data = await response.json() as Auth0User;
    return data;
}
/**
 * Get a user by ID from Auth0
 * @param id User ID
 * @param params Optional field selection params
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
    const url = new URL(`${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`);
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
    const data = await response.json() as Auth0User;
    return data;
}

import { getAuth0AccessToken } from '../../utils/auth0';
import { Auth0User, Auth0UserListResponse } from './user.types';
import { handleAuth0Error } from '../../utils/errors';
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';

/**
 * List or search users in Auth0
 * @param params Query parameters for search, pagination, sorting, and field selection
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
    const url = new URL(`${AUTH0_DOMAIN}/api/v2/users`);
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
    const data = await response.json();

    // Check if the response is a paginated response or just an array
    if (data && typeof data === 'object' && 'total' in data) {
        return data as Auth0UserListResponse;
    }
    return data as Auth0User[];
}

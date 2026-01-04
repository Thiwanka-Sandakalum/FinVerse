/**
 * Role Model
 * Handles all Auth0 API interactions for roles
 */


import { getAuth0AccessToken } from '../utils/auth0';
import { Auth0Role, RoleListResponse } from '../types/role.types';

/**
 * Get roles from Auth0
 */
export async function getRoles(params: {
    per_page?: number;
    page?: number;
    include_totals?: boolean;
    name_filter?: string;
} = {}): Promise<RoleListResponse> {
    const token = await getAuth0AccessToken();
    const url = new URL(`${process.env.AUTH0_DOMAIN}/api/v2/roles`);

    const page = params.page || 0;
    const limit = params.per_page || 25;

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Auth0 get roles failed: ${response.status} ${response.statusText} - ${error}`);
    }

    const auth0Response = await response.json() as Auth0Role[];

    return {
        pagination: {
            page: page + 1,
            limit,
            total: auth0Response.length || 0
        },
        items: auth0Response || []
    };
}

import { getAuth0AccessToken } from '../../utils/auth0';
import { Auth0Role, Auth0RoleListResponse } from './role.types';
import { PaginatedResponse } from '../../interfaces/response';
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';

/**
 * Get roles from Auth0
 * @param params Query parameters for pagination and filtering
 */
export async function getRoles(params: {
    per_page?: number;
    page?: number;
    include_totals?: boolean;
    name_filter?: string;
} = {}): Promise<PaginatedResponse<Auth0Role>> {
    let auth0Response: any | undefined;
    const token = await getAuth0AccessToken();
    const url = new URL(`${AUTH0_DOMAIN}/api/v2/roles`);

    // // Ensure pagination parameters
    const page = params.page || 0; // Auth0 uses 0-based pagination
    const limit = params.per_page || 25;
    const from = page * limit;

    try {
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

        auth0Response = await response.json();
        // Return the transformed response
        return {
            pagination: {
                page: page + 1, // Convert back to 1-based pagination for response
                limit,
                total: auth0Response.total || 0
            },
            items: auth0Response || []
        };
    } catch (error) {
        console.error('Error fetching roles from Auth0:', error);
        throw error;
    }
}

import { getAuth0AccessToken } from '../../utils/auth0';
import { Auth0User, Auth0UserListResponse, EnhancedUser, EnhancedUserListResponse, UserAppMetadata, UserMetadata, LoginCallbackResponse } from './user.types';
import { handleAuth0Error } from '../../utils/errors';
import { verifyToken, DecodedToken } from '../../utils/jwt';
import { createOrganization } from '../organizations/org.service';
import { Organization, OrganizationCreateRequest, OrganizationMetadata } from '../organizations/org.types';
import { jwtDecode } from 'jwt-decode';

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';

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

/**
 * List or search users in Auth0 with enhanced organization information
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
} = {}): Promise<EnhancedUserListResponse | EnhancedUser[]> {
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

    let users: Auth0User[] = [];
    let responseData: EnhancedUserListResponse | EnhancedUser[];

    // Extract users array
    if (data && typeof data === 'object' && 'users' in data) {
        users = (data as Auth0UserListResponse).users || [];
    } else if (Array.isArray(data)) {
        users = data as Auth0User[];
    }

    // Enhance users with organization information
    const enhancedUsers = await enhanceUsersWithOrganizations(users);

    // Return in same format as input
    if (data && typeof data === 'object' && 'total' in data) {
        responseData = {
            ...data,
            users: enhancedUsers
        } as EnhancedUserListResponse;
    } else {
        responseData = enhancedUsers;
    }

    return responseData;
}

/**
 * Enhance users with organization information
 * @param users Array of Auth0 users
 * @returns Enhanced users with organization data
 */
async function enhanceUsersWithOrganizations(users: Auth0User[]): Promise<EnhancedUser[]> {
    const token = await getAuth0AccessToken();
    const organizationCache = new Map<string, Organization>();

    return Promise.all(
        users.map(async (user): Promise<EnhancedUser> => {
            const enhancedUser: EnhancedUser = { ...user };

            if (user.app_metadata?.org_id) {
                const orgId = user.app_metadata.org_id;

                // Check cache first
                if (!organizationCache.has(orgId)) {
                    try {
                        const orgResponse = await fetch(`${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (orgResponse.ok) {
                            const organization = await orgResponse.json() as Organization;
                            organizationCache.set(orgId, organization);
                        }
                    } catch (error) {
                        console.error(`Failed to fetch organization ${orgId}:`, error);
                    }
                }

                const organization = organizationCache.get(orgId);
                if (organization) {
                    enhancedUser.organization = {
                        id: organization.id,
                        name: organization.name,
                        display_name: organization.display_name
                    };
                }
            }

            return enhancedUser;
        })
    );
}

/**
 * Handle user login callback workflow with complete post-registration process
 * @param token JWT token from Auth0
 * @returns Login callback response with enhanced user data
 */
export async function handleLoginCallback(token: string): Promise<LoginCallbackResponse> {
    try {
        console.log(`[${new Date().toISOString()}] INFO: Starting login callback workflow`);

        // Step 1: Verify and decode the JWT token
        let decodedToken: DecodedToken;
        try {
            decodedToken = jwtDecode(token);
            console.log(`[${new Date().toISOString()}] INFO: Token verified successfully for user: ${decodedToken.sub}`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] ERROR: Token verification failed:`, error);
            throw new Error('Invalid or expired token');
        }

        // Step 2: Fetch user profile from Auth0
        let user: Auth0User;
        try {
            user = await getUserById(decodedToken.sub);
            console.log(`[${new Date().toISOString()}] INFO: Fetched user profile for: ${user.email}`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] ERROR: Failed to fetch user profile:`, error);
            throw new Error('Failed to retrieve user profile');
        }

        let updatedUser = user;
        let message = 'User login successful';

        // Step 3: Handle company users without organization (complete post-registration flow)
        if (user.user_metadata?.isCompany && !user.app_metadata?.org_id) {
            console.log(`[${new Date().toISOString()}] INFO: Creating organization for company user: ${user.email}`);

            try {
                // Create organization with enhanced metadata
                const organization = await createEnhancedUserOrganization(user);
                console.log(`[${new Date().toISOString()}] INFO: Organization created: ${organization.id}`);

                // Add user to the organization
                await addUserToOrganization(organization.id, user.user_id);
                console.log(`[${new Date().toISOString()}] INFO: User ${user.email} added to organization ${organization.id}`);

                // Assign org admin role
                await assignUserToOrgAdminRole(user.user_id);
                console.log(`[${new Date().toISOString()}] INFO: Org admin role assigned to user ${user.email}`);

                // Update user metadata with org_id and role
                updatedUser = await updateUserMetadata(user.user_id, {
                    org_id: organization.id,
                    role: 'org_admin'
                });

                message = 'User login successful. Organization created, user added as member and assigned as admin.';
                console.log(`[${new Date().toISOString()}] INFO: User ${user.email} assigned as org admin for organization ${organization.id}`);
            } catch (error) {
                console.error(`[${new Date().toISOString()}] ERROR: Failed to complete organization setup:`, error);
                throw new Error('Failed to set up organization for company user');
            }
        }
        // Step 4: Handle individual users without role
        else if (!user.user_metadata?.isCompany && !user.app_metadata?.role) {
            console.log(`[${new Date().toISOString()}] INFO: Assigning member role to individual user: ${user.email}`);

            try {
                // Assign member role
                updatedUser = await updateUserMetadata(user.user_id, {
                    role: 'member'
                });

                message = 'User login successful. Member role assigned.';
                console.log(`[${new Date().toISOString()}] INFO: User ${user.email} assigned member role`);
            } catch (error) {
                console.error(`[${new Date().toISOString()}] ERROR: Failed to assign member role:`, error);
                throw new Error('Failed to assign role to user');
            }
        }

        // Step 5: Enhance user with organization information
        const enhancedUsers = await enhanceUsersWithOrganizations([updatedUser]);
        const enhancedUser = enhancedUsers[0];

        console.log(`[${new Date().toISOString()}] INFO: Login callback completed successfully for user: ${user.email}`);

        return {
            success: true,
            user: enhancedUser,
            message
        };

    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERROR: Login callback failed:`, error);

        return {
            success: false,
            user: {} as EnhancedUser,
            message: error instanceof Error ? error.message : 'Login callback failed'
        };
    }
}

/**
 * Create organization for a company user
 * @param user Auth0 user object
 * @returns Created organization
 */
async function createUserOrganization(user: Auth0User): Promise<Organization> {
    const orgMetadata: OrganizationMetadata = {
        description: `Organization for ${user.user_metadata?.companyName || user.name || user.email}`,
        contactEmail: user.email
    };

    const orgRequest: OrganizationCreateRequest = {
        name: generateOrganizationName(user),
        display_name: user.user_metadata?.companyName || user.name || user.email || 'Unknown Company',
        metadata: orgMetadata
    };

    return await createOrganization(orgRequest);
}

/**
 * Generate a valid organization name from user data
 * @param user Auth0 user object
 * @returns Valid organization name
 */
function generateOrganizationName(user: Auth0User): string {
    // Try company name first, then user name, then email prefix
    let baseName = user.user_metadata?.companyName ||
        user.name ||
        user.email?.split('@')[0] ||
        'unknown-org';

    // Clean the name to match Auth0 organization name requirements
    // Only letters, numbers, and hyphens, must start and end with letter/number
    baseName = baseName.toLowerCase()
        .replace(/[^a-z0-9\-]/g, '-')  // Replace invalid chars with hyphens
        .replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
        .replace(/-+/g, '-');          // Replace multiple hyphens with single

    // Ensure it starts and ends with alphanumeric
    if (!/^[a-z0-9]/.test(baseName)) {
        baseName = 'org-' + baseName;
    }
    if (!/[a-z0-9]$/.test(baseName)) {
        baseName = baseName + '-org';
    }

    // Add timestamp suffix to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    return `${baseName}-${timestamp}`;
}

/**
 * Update user app_metadata in Auth0
 * @param userId User ID
 * @param metadata Metadata to update
 * @returns Updated user
 */
async function updateUserMetadata(userId: string, metadata: Partial<UserAppMetadata>): Promise<Auth0User> {
    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`;

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
 * Create enhanced organization for a company user with full metadata
 * @param user Auth0 user object
 * @returns Created organization
 */
async function createEnhancedUserOrganization(user: Auth0User): Promise<Organization> {
    const meta = user.user_metadata || {};

    const orgMetadata: OrganizationMetadata = {
        description: `Organization for ${meta.companyName || user.name || user.email}`,
        contactEmail: user.email,
        country: meta.country,
        website: meta.website,
        logoUrl: meta.logoUrl || "https://example.com/default-logo.png",
        industryType: meta.industry, // This should match IndustryType enum
        establishedYear: meta.establishedYear,
        numberOfEmployees: meta.numberOfEmployees,
        numberOfBranches: meta.numberOfBranches,
        contactPhone: meta.contactPhone,
        headquartersAddress: meta.headquartersAddress,
        region: meta.region,
        registrationNumber: meta.registrationNumber,
        supportedProducts: meta.supportedProducts
    };

    const orgRequest: OrganizationCreateRequest = {
        name: generateOrganizationName(user),
        display_name: meta.companyName || user.name || user.email || 'New Organization',
        metadata: orgMetadata
    };

    return await createOrganization(orgRequest);
}

/**
 * Add user to organization as a member
 * @param orgId Organization ID
 * @param userId User ID
 */
async function addUserToOrganization(orgId: string, userId: string): Promise<void> {
    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/organizations/${encodeURIComponent(orgId)}/members`;

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
        console.error('❌ Error adding user to organization:', error);
        throw new Error(`Failed to add user to organization: ${response.status} ${response.statusText} - ${error}`);
    }

    console.log('✅ User successfully added to organization');
}

/**
 * Assign user to organization admin role
 * @param userId User ID
 */
async function assignUserToOrgAdminRole(userId: string): Promise<void> {
    const ORG_ADMIN_ROLE_ID = process.env.ORG_ADMIN_ROLE_ID;

    if (!ORG_ADMIN_ROLE_ID) {
        console.warn('⚠️ ORG_ADMIN_ROLE_ID not found in environment variables, skipping role assignment.');
        return;
    }

    const token = await getAuth0AccessToken();
    const url = `${AUTH0_DOMAIN}/api/v2/roles/${encodeURIComponent(ORG_ADMIN_ROLE_ID)}/users`;

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
        console.error('❌ Error assigning user to org admin role:', error);
        throw new Error(`Failed to assign user to role: ${response.status} ${response.statusText} - ${error}`);
    }

    console.log('✅ User successfully assigned to org admin role');
}

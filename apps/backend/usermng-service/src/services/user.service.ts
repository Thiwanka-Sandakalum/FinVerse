/**
 * User Service
 * Contains business logic for user operations
 */

import * as UserModel from '../models/user.model';
import * as UserValidation from '../validations/user.validation';
import { config } from '../config/env';
import {
    Auth0User,
    EnhancedUser,
    EnhancedUserListResponse,
    Auth0UserListResponse,
} from '../types/user.types';
import { Organization } from '../types/organization.types';

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<void> {
    await UserModel.deleteUser(id);
}

/**
 * Update a user
 */
export async function updateUser(id: string, updates: any): Promise<Auth0User> {
    const validatedUpdates = UserValidation.validateUserUpdate(updates);
    return await UserModel.updateUser(id, validatedUpdates);
}

/**
 * Get user by ID
 */
export async function getUserById(
    id: string,
    params: {
        fields?: string;
        include_fields?: boolean;
    } = {}
): Promise<Auth0User> {
    return await UserModel.getUserById(id, params);
}

/**
 * Get list of users with enhanced organization information
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
    const data = await UserModel.getUsers(params);

    let users: Auth0User[] = [];

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
        return {
            ...data,
            users: enhancedUsers
        } as EnhancedUserListResponse;
    } else {
        return enhancedUsers;
    }
}

/**
 * Enhance users with organization information
 * Business logic: fetch organization details for each user
 */
async function enhanceUsersWithOrganizations(users: Auth0User[]): Promise<EnhancedUser[]> {
    const organizationCache = new Map<string, Organization>();

    return Promise.all(
        users.map(async (user): Promise<EnhancedUser> => {
            const enhancedUser: EnhancedUser = { ...user };

            if (user.app_metadata?.org_id) {
                const orgId = user.app_metadata.org_id;

                // Check cache first
                if (!organizationCache.has(orgId)) {
                    try {
                        const organization = await UserModel.getOrganizationById(orgId);
                        organizationCache.set(orgId, organization);
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

/**
 * Role-Based Permission Configuration
 * Defines what each role can access and manage
 */

import { UserRole, RoleConfig, PermissionAction } from '@/src/types/rbac.types';

/**
 * Comprehensive permission matrix for each role
 * SUPER_ADMIN: Full access to all resources and operations
 * ORG_ADMIN: Can manage users and products within their organization
 * MEMBER: Read-only access to products, basic settings access
 */
export const ROLE_PERMISSIONS: RoleConfig = {
    [UserRole.SUPER_ADMIN]: {
        view: ['dashboard', 'organizations', 'users', 'products', 'settings'],
        create: ['organizations', 'users', 'products'],
        edit: ['organizations', 'users', 'products'],
        delete: ['organizations', 'users', 'products'],
        manage: ['organizations', 'users', 'products', 'settings']
    },

    [UserRole.ORG_ADMIN]: {
        view: ['dashboard', 'users', 'products', 'settings'],
        create: ['users', 'products'],
        edit: ['users', 'products'],
        delete: ['users', 'products'],
        manage: ['users', 'products'] // Can manage within own org only
    },

    [UserRole.MEMBER]: {
        view: ['dashboard', 'products', 'settings'],
        create: [],
        edit: [],
        delete: [],
        manage: [] // Cannot manage any resources
    }
};

/**
 * Pages/tabs that are hidden for specific roles
 * Used to hide navigation items and restrict access
 */
export const RESTRICTED_TABS: Partial<Record<UserRole, string[]>> = {
    [UserRole.ORG_ADMIN]: ['organizations'], // OrgAdmin cannot see other organizations
    [UserRole.MEMBER]: ['organizations', 'users'] // Member can only see products
};

/**
 * Check if a user role can perform an action on a resource
 * @param role User's role
 * @param action Permission action (view, create, edit, delete, manage)
 * @param resource Resource name (organizations, users, products, settings)
 * @returns true if user has permission
 */
export const hasPermission = (role: UserRole, action: PermissionAction, resource: string): boolean => {
    try {
        const permissions = ROLE_PERMISSIONS[role];
        if (!permissions) return false;
        return permissions[action]?.includes(resource) ?? false;
    } catch (error) {
        console.error(`Error checking permission: ${role} ${action} ${resource}`, error);
        return false;
    }
};

/**
 * Get all allowed resources for a specific action and role
 * @param role User's role
 * @param action Permission action
 * @returns Array of allowed resources
 */
export const getAllowedResources = (role: UserRole, action: PermissionAction): string[] => {
    try {
        return ROLE_PERMISSIONS[role]?.[action] ?? [];
    } catch (error) {
        console.error(`Error getting allowed resources: ${role} ${action}`, error);
        return [];
    }
};

/**
 * Check if a tab/page is hidden for a specific role
 * @param role User's role
 * @param tab Tab/page name
 * @returns true if tab is hidden
 */
export const isTabRestricted = (role: UserRole, tab: string): boolean => {
    return RESTRICTED_TABS[role]?.includes(tab) ?? false;
};

/**
 * Get display name for a user role
 * @param role User's role
 * @returns Human-readable role name
 */
export const getRoleDisplayName = (role: UserRole): string => {
    const displayNames: Record<UserRole, string> = {
        [UserRole.SUPER_ADMIN]: 'Super Administrator',
        [UserRole.ORG_ADMIN]: 'Organization Administrator',
        [UserRole.MEMBER]: 'Member'
    };
    return displayNames[role] || 'Unknown Role';
};

/**
 * Get role description for documentation/help
 * @param role User's role
 * @returns Role description
 */
export const getRoleDescription = (role: UserRole): string => {
    const descriptions: Record<UserRole, string> = {
        [UserRole.SUPER_ADMIN]: 'Full system access. Can manage all organizations, users, and products.',
        [UserRole.ORG_ADMIN]: 'Can manage users and products within their organization. Cannot view other organizations.',
        [UserRole.MEMBER]: 'Read-only access to products. Can view personal settings and dashboard.'
    };
    return descriptions[role] || 'No description available';
};

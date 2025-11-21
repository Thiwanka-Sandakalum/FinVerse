/**
 * Permission Constants and Role-to-Permission Mappings
 * This file defines the core RBAC logic for the FinVerse Admin Dashboard
 */

import { UserRole, Permission } from '../types/auth.types';
import type { RolePermissions } from '../types/auth.types';

// Permission constants organized by feature area
export const PERMISSIONS = {
    // Dashboard permissions
    DASHBOARD: {
        VIEW: 'view_dashboard' as Permission,
    },

    // Organization permissions  
    ORGANIZATIONS: {
        VIEW: 'view_organizations' as Permission,
        CREATE: 'create_organizations' as Permission,
        EDIT: 'edit_organizations' as Permission,
        DELETE: 'delete_organizations' as Permission,
    },

    // User management permissions
    USERS: {
        VIEW: 'view_users' as Permission,
        CREATE: 'create_users' as Permission,
        EDIT: 'edit_users' as Permission,
        DELETE: 'delete_users' as Permission,
    },

    // Product management permissions
    PRODUCTS: {
        VIEW: 'view_products' as Permission,
        CREATE: 'create_products' as Permission,
        EDIT: 'edit_products' as Permission,
        DELETE: 'delete_products' as Permission,
    },

    // Analytics permissions
    ANALYTICS: {
        VIEW: 'view_analytics' as Permission,
    },

    // Settings permissions
    SETTINGS: {
        VIEW: 'view_settings' as Permission,
        EDIT: 'edit_settings' as Permission,
    },
} as const;

// Comprehensive role-to-permission mapping
export const ROLE_PERMISSIONS: RolePermissions = {
    [UserRole.SUPER_ADMIN]: [
        // Super admin has all permissions
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.ORGANIZATIONS.VIEW,
        PERMISSIONS.ORGANIZATIONS.CREATE,
        PERMISSIONS.ORGANIZATIONS.EDIT,
        PERMISSIONS.ORGANIZATIONS.DELETE,
        PERMISSIONS.USERS.VIEW,
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.EDIT,
        PERMISSIONS.USERS.DELETE,
        PERMISSIONS.PRODUCTS.VIEW,
        PERMISSIONS.PRODUCTS.CREATE,
        PERMISSIONS.PRODUCTS.EDIT,
        PERMISSIONS.PRODUCTS.DELETE,
        PERMISSIONS.ANALYTICS.VIEW,
        PERMISSIONS.SETTINGS.VIEW,
        PERMISSIONS.SETTINGS.EDIT,
    ],

    [UserRole.ORG_ADMIN]: [
        // Org admin: product management + user management (limited)
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.ORGANIZATIONS.VIEW,
        PERMISSIONS.ORGANIZATIONS.EDIT, // Can edit their own org only
        PERMISSIONS.USERS.VIEW,
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.EDIT,
        PERMISSIONS.PRODUCTS.VIEW,
        PERMISSIONS.PRODUCTS.CREATE,
        PERMISSIONS.PRODUCTS.EDIT,
        PERMISSIONS.PRODUCTS.DELETE,
    ],

    [UserRole.MEMBER]: [
        // Member: product management only
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.PRODUCTS.VIEW,
        PERMISSIONS.PRODUCTS.CREATE,
        PERMISSIONS.PRODUCTS.EDIT,
        PERMISSIONS.PRODUCTS.DELETE,
    ],
};

// Helper functions for permission checking
export const hasPermission = (userRole: UserRole | null, permission: Permission): boolean => {
    if (!userRole) return false;
    return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasAnyPermission = (userRole: UserRole | null, permissions: Permission[]): boolean => {
    if (!userRole || !permissions.length) return false;
    return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: UserRole | null, permissions: Permission[]): boolean => {
    if (!userRole || !permissions.length) return false;
    return permissions.every(permission => hasPermission(userRole, permission));
};

export const getRolePermissions = (userRole: UserRole): Permission[] => {
    return ROLE_PERMISSIONS[userRole] || [];
};

export const hasRole = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
    return userRole === requiredRole;
};

export const hasAnyRole = (userRole: UserRole | null, requiredRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
};

// Role hierarchy helper (higher roles inherit lower role permissions)
export const ROLE_HIERARCHY = {
    [UserRole.SUPER_ADMIN]: 3,
    [UserRole.ORG_ADMIN]: 2,
    [UserRole.MEMBER]: 1,
} as const;

export const hasRoleOrHigher = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
    if (!userRole) return false;
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Feature-specific permission groups for easier checking
export const FEATURE_PERMISSIONS = {
    ORGANIZATION_MANAGEMENT: [
        PERMISSIONS.ORGANIZATIONS.VIEW,
        PERMISSIONS.ORGANIZATIONS.CREATE,
        PERMISSIONS.ORGANIZATIONS.EDIT,
        PERMISSIONS.ORGANIZATIONS.DELETE,
    ],
    USER_MANAGEMENT: [
        PERMISSIONS.USERS.VIEW,
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.EDIT,
        PERMISSIONS.USERS.DELETE,
    ],
    PRODUCT_MANAGEMENT: [
        PERMISSIONS.PRODUCTS.VIEW,
        PERMISSIONS.PRODUCTS.CREATE,
        PERMISSIONS.PRODUCTS.EDIT,
        PERMISSIONS.PRODUCTS.DELETE,
    ],
    ANALYTICS_ACCESS: [
        PERMISSIONS.ANALYTICS.VIEW,
    ],
    SYSTEM_ADMINISTRATION: [
        PERMISSIONS.SETTINGS.VIEW,
        PERMISSIONS.SETTINGS.EDIT,
    ],
} as const;

// Check if user has access to a feature area
export const hasFeatureAccess = (userRole: UserRole | null, feature: keyof typeof FEATURE_PERMISSIONS): boolean => {
    if (!userRole) return false;
    const requiredPermissions = [...FEATURE_PERMISSIONS[feature]]; // Convert readonly to mutable
    return hasAnyPermission(userRole, requiredPermissions);
};

// Get readable role name
export const getRoleDisplayName = (role: UserRole): string => {
    const roleNames = {
        [UserRole.SUPER_ADMIN]: 'Super Administrator',
        [UserRole.ORG_ADMIN]: 'Organization Administrator',
        [UserRole.MEMBER]: 'Member',
    };
    return roleNames[role] || 'Unknown Role';
};

// Get role color for UI display
export const getRoleColor = (role: UserRole): string => {
    const roleColors = {
        [UserRole.SUPER_ADMIN]: 'red',
        [UserRole.ORG_ADMIN]: 'blue',
        [UserRole.MEMBER]: 'green',
    };
    return roleColors[role] || 'gray';
};
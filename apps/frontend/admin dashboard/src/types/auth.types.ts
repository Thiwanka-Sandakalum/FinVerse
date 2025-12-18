/**
 * Authentication and Authorization Types for FinVerse Admin Dashboard
 */

import { User } from '@auth0/auth0-react';

// Core role definitions
export const UserRole = {
    SUPER_ADMIN: 'super_admin',
    ORG_ADMIN: 'org_admin',
    MEMBER: 'member'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Permission categories
export const Permission = {
    // Dashboard permissions
    VIEW_DASHBOARD: 'view_dashboard',

    // Organization permissions
    VIEW_ORGANIZATIONS: 'view_organizations',
    CREATE_ORGANIZATIONS: 'create_organizations',
    EDIT_ORGANIZATIONS: 'edit_organizations',
    DELETE_ORGANIZATIONS: 'delete_organizations',

    // User management permissions
    VIEW_USERS: 'view_users',
    CREATE_USERS: 'create_users',
    EDIT_USERS: 'edit_users',
    DELETE_USERS: 'delete_users',

    // Product management permissions
    VIEW_PRODUCTS: 'view_products',
    CREATE_PRODUCTS: 'create_products',
    EDIT_PRODUCTS: 'edit_products',
    DELETE_PRODUCTS: 'delete_products',

    // Analytics permissions
    VIEW_ANALYTICS: 'view_analytics',

    // Settings permissions
    VIEW_SETTINGS: 'view_settings',
    EDIT_SETTINGS: 'edit_settings'
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

// Role-based permission mapping
export type RolePermissions = {
    [key in UserRole]: Permission[];
};

// Extended user interface with role information
export interface AuthenticatedUser extends User {
    role?: UserRole;
    permissions?: Permission[];
    organizationId?: string;
    organizationName?: string;
}

// Auth context state interface
export interface AuthState {
    user: AuthenticatedUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    role: UserRole | null;
    permissions: Permission[];
}

// Route access configuration
export interface RouteAccess {
    path: string;
    allowedRoles: UserRole[];
    requiredPermissions?: Permission[];
    redirectTo?: string;
}

// Permission check result
export interface PermissionCheckResult {
    hasAccess: boolean;
    missingPermissions?: Permission[];
    requiredRole?: UserRole;
    redirectTo?: string;
}

// Auth0 custom claims interface (what we expect in the token)
export interface Auth0CustomClaims {
    'https://finverse.com/role'?: string;
    'https://finverse.com/organization_id'?: string;
    'https://finverse.com/organization_name'?: string;
    'https://finverse.com/permissions'?: string[];
}

// Hook return types
export interface UseAuthReturn extends AuthState {
    login: () => void;
    logout: () => void;
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
    getUserDefaultRoute: () => string;
}

export interface UsePermissionsReturn {
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
    checkRouteAccess: (path?: string) => PermissionCheckResult;
    checkFeatureAccess: (feature: string) => boolean;
    userPermissions: Permission[];
}

// Component prop types for RBAC components
export interface RoleGuardProps {
    allowedRoles: UserRole | UserRole[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export interface PermissionCheckProps {
    permission: Permission | Permission[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    requiredPermissions?: Permission[];
    fallback?: React.ReactNode;
    redirectTo?: string;
    children: React.ReactNode;
}
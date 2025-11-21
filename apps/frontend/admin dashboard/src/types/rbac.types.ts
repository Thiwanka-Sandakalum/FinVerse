/**
 * Role-Based Access Control (RBAC) specific types and interfaces
 */

import type { UserRole, Permission, AuthenticatedUser } from './auth.types';

// RBAC configuration interface
export interface RBACConfig {
    roles: UserRole[];
    permissions: Permission[];
    rolePermissions: RolePermissionMatrix;
    routeAccess: RouteAccessConfig;
    defaultRedirects: DefaultRedirectConfig;
}

// Role-permission matrix for easy lookup
export interface RolePermissionMatrix {
    [UserRole.SUPER_ADMIN]: Permission[];
    [UserRole.ORG_ADMIN]: Permission[];
    [UserRole.MEMBER]: Permission[];
}

// Route access configuration matrix
export interface RouteAccessConfig {
    [key: string]: {
        allowedRoles: UserRole[];
        requiredPermissions?: Permission[];
        redirectTo?: string;
        exactMatch?: boolean;
    };
}

// Default redirect configuration for different scenarios
export interface DefaultRedirectConfig {
    unauthorized: string;
    forbidden: string;
    roleBasedHome: {
        [UserRole.SUPER_ADMIN]: string;
        [UserRole.ORG_ADMIN]: string;
        [UserRole.MEMBER]: string;
    };
}

// Navigation item with RBAC constraints
export interface SecuredNavigationItem {
    label: string;
    icon: React.ReactNode;
    path?: string;
    children?: SecuredNavigationItem[];
    allowedRoles?: UserRole[];
    requiredPermissions?: Permission[];
    badge?: string;
    disabled?: boolean;
}

// Access control result for UI components
export interface AccessControlResult {
    allowed: boolean;
    reason?: 'role' | 'permission' | 'route' | 'disabled';
    message?: string;
    suggestedAction?: string;
    requiredRole?: UserRole;
    requiredPermissions?: Permission[];
}

// RBAC context state
export interface RBACState {
    isInitialized: boolean;
    config: RBACConfig;
    userRole: UserRole | null;
    userPermissions: Permission[];
    isLoading: boolean;
    error: string | null;
}

// RBAC provider props
export interface RBACProviderProps {
    children: React.ReactNode;
    config?: Partial<RBACConfig>;
    fallbackRole?: UserRole;
}

// Role assignment interface (for future admin features)
export interface RoleAssignment {
    userId: string;
    userName: string;
    userEmail: string;
    currentRole: UserRole;
    organizationId?: string;
    assignedBy: string;
    assignedAt: Date;
    expiresAt?: Date;
}

// Permission audit log interface (for future audit features)
export interface PermissionAuditLog {
    id: string;
    userId: string;
    userName: string;
    action: 'granted' | 'denied' | 'revoked';
    permission: Permission;
    resource: string;
    timestamp: Date;
    reason?: string;
}

// Feature flag interface for role-based features
export interface RoleBasedFeatureFlag {
    featureName: string;
    enabledForRoles: UserRole[];
    requiredPermissions?: Permission[];
    metadata?: Record<string, any>;
}

// Route guard configuration
export interface RouteGuardConfig {
    strict: boolean; // If true, user must have ALL specified roles/permissions
    fallbackRoute: string;
    showAccessDenied: boolean;
    logAccessAttempts: boolean;
}

// Dynamic permission interface (for runtime permission calculations)
export interface DynamicPermission {
    permission: Permission;
    condition: (user: AuthenticatedUser, context?: any) => boolean;
    description: string;
}

// RBAC hook configuration
export interface UseRBACConfig {
    autoRedirect: boolean;
    fallbackRoute: string;
    enableLogging: boolean;
    cachePermissions: boolean;
}
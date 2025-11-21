/**
 * Permission Checking Hook for Component-Level Access Control
 * Provides utilities for checking permissions and managing UI access
 */

import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Permission } from '../types/auth.types';
import type { UsePermissionsReturn, PermissionCheckResult } from '../types/auth.types';
import { useAuth } from './useAuth';
import { checkRouteAccess } from '../utils/routeAccess';
import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasFeatureAccess,
    FEATURE_PERMISSIONS
} from '../utils/permissions';

/**
 * Hook for checking user permissions at component level
 * Provides granular access control for UI elements
 */
export const usePermissions = (): UsePermissionsReturn => {
    const { role, permissions } = useAuth();
    const location = useLocation();

    // Check if user has a specific permission
    const checkPermission = useCallback((permission: Permission): boolean => {
        return hasPermission(role, permission);
    }, [role]);

    // Check if user has any of the provided permissions
    const checkAnyPermission = useCallback((permissions: Permission[]): boolean => {
        return hasAnyPermission(role, permissions);
    }, [role]);

    // Check if user has all of the provided permissions
    const checkAllPermissions = useCallback((permissions: Permission[]): boolean => {
        return hasAllPermissions(role, permissions);
    }, [role]);

    // Check if user has access to current or specified route
    const checkRouteAccessPermission = useCallback((path?: string): PermissionCheckResult => {
        const routePath = path || location.pathname;
        return checkRouteAccess(routePath, role, permissions);
    }, [location.pathname, role, permissions]);

    // Check if user has access to a feature area
    const checkFeatureAccess = useCallback((feature: keyof typeof FEATURE_PERMISSIONS): boolean => {
        return hasFeatureAccess(role, feature);
    }, [role]);

    return {
        hasPermission: checkPermission,
        hasAnyPermission: checkAnyPermission,
        hasAllPermissions: checkAllPermissions,
        checkRouteAccess: checkRouteAccessPermission,
        checkFeatureAccess,
        userPermissions: permissions
    };
};

/**
 * Hook for conditional content rendering based on permissions
 * Returns boolean flags for common permission patterns
 */
export const usePermissionFlags = () => {
    const { hasPermission, checkFeatureAccess } = usePermissions();

    const flags = useMemo(() => ({
        // Organization management flags
        canViewOrganizations: checkFeatureAccess('ORGANIZATION_MANAGEMENT'),
        canCreateOrganizations: hasPermission(Permission.CREATE_ORGANIZATIONS),
        canEditOrganizations: hasPermission(Permission.EDIT_ORGANIZATIONS),
        canDeleteOrganizations: hasPermission(Permission.DELETE_ORGANIZATIONS),

        // User management flags
        canViewUsers: checkFeatureAccess('USER_MANAGEMENT'),
        canCreateUsers: hasPermission(Permission.CREATE_USERS),
        canEditUsers: hasPermission(Permission.EDIT_USERS),
        canDeleteUsers: hasPermission(Permission.DELETE_USERS),

        // Product management flags
        canViewProducts: checkFeatureAccess('PRODUCT_MANAGEMENT'),
        canCreateProducts: hasPermission(Permission.CREATE_PRODUCTS),
        canEditProducts: hasPermission(Permission.EDIT_PRODUCTS),
        canDeleteProducts: hasPermission(Permission.DELETE_PRODUCTS),

        // Analytics flags
        canViewAnalytics: checkFeatureAccess('ANALYTICS_ACCESS'),

        // Settings flags
        canViewSettings: hasPermission(Permission.VIEW_SETTINGS),
        canEditSettings: hasPermission(Permission.EDIT_SETTINGS),
        canManageSystem: checkFeatureAccess('SYSTEM_ADMINISTRATION')
    }), [hasPermission, checkFeatureAccess]);

    return flags;
};

/**
 * Hook for getting permission-based UI configuration
 * Returns configuration objects for common UI patterns
 */
export const usePermissionConfig = () => {
    const flags = usePermissionFlags();
    const { role } = useAuth();

    const config = useMemo(() => ({
        // Navigation configuration
        navigation: {
            showOrganizations: flags.canViewOrganizations,
            showUsers: flags.canViewUsers,
            showProducts: flags.canViewProducts,
            showAnalytics: flags.canViewAnalytics,
            showSettings: flags.canViewSettings
        },

        // Action button configuration
        actions: {
            organizations: {
                create: flags.canCreateOrganizations,
                edit: flags.canEditOrganizations,
                delete: flags.canDeleteOrganizations
            },
            users: {
                create: flags.canCreateUsers,
                edit: flags.canEditUsers,
                delete: flags.canDeleteUsers
            },
            products: {
                create: flags.canCreateProducts,
                edit: flags.canEditProducts,
                delete: flags.canDeleteProducts
            }
        },

        // Feature toggles
        features: {
            organizationManagement: flags.canViewOrganizations,
            userManagement: flags.canViewUsers,
            productManagement: flags.canViewProducts,
            analytics: flags.canViewAnalytics,
            systemSettings: flags.canManageSystem
        },

        // Role-specific UI hints
        ui: {
            showRoleBadge: !!role,
            showPermissionHints: role !== 'super_admin', // Don't show hints to super admin
            showUpgradePrompts: role === 'member', // Show upgrade prompts to members
            restrictedFeatureCount: Object.values(flags).filter(flag => !flag).length
        }
    }), [flags, role]);

    return config;
};

/**
 * Hook for permission-based form validation
 * Returns validation rules based on user permissions
 */
export const usePermissionValidation = () => {
    const { hasPermission } = usePermissions();

    const getFieldPermissions = useCallback((entityType: 'organization' | 'user' | 'product') => {
        const permissions = {
            organization: {
                canEdit: hasPermission(Permission.EDIT_ORGANIZATIONS),
                canCreate: hasPermission(Permission.CREATE_ORGANIZATIONS),
                canDelete: hasPermission(Permission.DELETE_ORGANIZATIONS)
            },
            user: {
                canEdit: hasPermission(Permission.EDIT_USERS),
                canCreate: hasPermission(Permission.CREATE_USERS),
                canDelete: hasPermission(Permission.DELETE_USERS)
            },
            product: {
                canEdit: hasPermission(Permission.EDIT_PRODUCTS),
                canCreate: hasPermission(Permission.CREATE_PRODUCTS),
                canDelete: hasPermission(Permission.DELETE_PRODUCTS)
            }
        };

        return permissions[entityType];
    }, [hasPermission]);

    return { getFieldPermissions };
};

/**
 * Hook for role-based content filtering
 * Filters arrays of items based on user permissions
 */
export const usePermissionFilter = () => {
    const { hasPermission } = usePermissions();
    const { role } = useAuth();

    const filterByPermission = useCallback(<T extends { requiredPermission?: Permission }>(
        items: T[],
        defaultPermission?: Permission
    ): T[] => {
        return items.filter(item => {
            const requiredPerm = item.requiredPermission || defaultPermission;
            return !requiredPerm || hasPermission(requiredPerm);
        });
    }, [hasPermission]);

    const filterByRole = useCallback(<T extends { allowedRoles?: string[] }>(
        items: T[]
    ): T[] => {
        return items.filter(item => {
            if (!item.allowedRoles) return true;
            return role && item.allowedRoles.includes(role);
        });
    }, [role]);

    return {
        filterByPermission,
        filterByRole
    };
};
/**
 * Permission Checking Hook
 * Provides utilities to check user permissions throughout the app
 */

import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserRole, PermissionAction } from '@/src/types/rbac.types';
import { hasPermission, getRoleDisplayName } from '@/src/config/rolePermissions';

/**
 * Hook to check user permissions
 * Usage:
 *   const { can, cannot } = usePermission();
 *   if (can('view', 'users')) { ... }
 */
export const usePermission = () => {
    const { user: auth0User } = useAuth0();

    // Extract role from Auth0 user
    // Auth0 stores role in: user.role.roles[0]
    const extractUserRole = (): UserRole => {
        if (!auth0User?.role?.roles?.[0]) {
            return UserRole.MEMBER; // Default fallback
        }

        const roleString = auth0User.role.roles[0];

        switch (roleString) {
            case 'super_admin':
                return UserRole.SUPER_ADMIN;
            case 'org_admin':
                return UserRole.ORG_ADMIN;
            case 'member':
                return UserRole.MEMBER;
            default:
                return UserRole.MEMBER; // Safe default
        }
    };

    const userRole: UserRole = extractUserRole();

    /**
     * Check if user has permission for an action on a resource
     */
    const can = useCallback(
        (resource: string, action: PermissionAction = 'view'): boolean => {
            return hasPermission(userRole, action, resource);
        },
        [userRole]
    );

    /**
     * Inverse of can() - check if user CANNOT perform action
     */
    const cannot = useCallback(
        (resource: string, action: PermissionAction = 'view'): boolean => {
            return !can(resource, action);
        },
        [can]
    );

    /**
     * Check if user can view a page
     */
    const canView = useCallback((page: string): boolean => {
        return can(page, 'view');
    }, [can]);

    /**
     * Check if user can create a resource
     */
    const canCreate = useCallback((resource: string): boolean => {
        return can(resource, 'create');
    }, [can]);

    /**
     * Check if user can edit a resource
     */
    const canEdit = useCallback((resource: string): boolean => {
        return can(resource, 'edit');
    }, [can]);

    /**
     * Check if user can delete a resource
     */
    const canDelete = useCallback((resource: string): boolean => {
        return can(resource, 'delete');
    }, [can]);

    /**
     * Check if user can manage a resource (full control)
     */
    const canManage = useCallback((resource: string): boolean => {
        return can(resource, 'manage');
    }, [can]);

    return {
        userRole,
        can,
        cannot,
        canView,
        canCreate,
        canEdit,
        canDelete,
        canManage,
        roleDisplayName: getRoleDisplayName(userRole),
        orgId: auth0User?.orgId // Expose org_id for data filtering
    };
};

/**
 * Hook to check if a resource is accessible
 * More semantic than usePermission for some use cases
 */
export const useAccess = () => {
    const { can, cannot } = usePermission();

    return {
        isAllowed: can,
        isBlocked: cannot
    };
};

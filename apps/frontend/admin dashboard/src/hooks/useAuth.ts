/**
 * Enhanced Auth Hook with RBAC capabilities
 * Extends Auth0 functionality with role-based access control
 */

import { useAuth0 } from '@auth0/auth0-react';
import { useMemo, useCallback } from 'react';
import { UserRole, Permission } from '../types/auth.types';
import type { UseAuthReturn, AuthenticatedUser, Auth0CustomClaims } from '../types/auth.types';
import {
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    getRolePermissions
} from '../utils/permissions';
import { getDefaultRoute } from '../utils/routeAccess';

/**
 * Enhanced authentication hook with RBAC support
 * Provides role and permission checking capabilities on top of Auth0
 */
export const useAuth = (): UseAuthReturn => {
    const {
        user: auth0User,
        isAuthenticated: auth0IsAuthenticated,
        isLoading: auth0IsLoading,
        error: auth0Error,
        loginWithRedirect,
        logout: auth0Logout,
        getIdTokenClaims
    } = useAuth0();

    // Extract user role from Auth0 user data (temporary implementation)
    // In production, this should come from Auth0 custom claims in the token
    const extractUserRole = useCallback((user: any): UserRole | undefined => {
        // Method 1: Check user metadata (if configured in Auth0)
        if (user?.user_metadata?.role) {
            return user.user_metadata.role as UserRole;
        }

        // Method 2: Check app metadata (if configured in Auth0)
        if (user?.app_metadata?.role) {
            return user.app_metadata.role as UserRole;
        }

        // Method 3: Derive from email domain (fallback for demo)
        if (user?.email) {
            if (user.email.includes('admin@finverse.com')) {
                return UserRole.SUPER_ADMIN;
            }
            if (user.email.includes('org@finverse.com') || user.email.includes('manager@')) {
                return UserRole.ORG_ADMIN;
            }
        }

        // Default role for authenticated users
        return UserRole.SUPER_ADMIN;
    }, []);

    // Extract role and organization info from Auth0 token claims
    const enhancedUser = useMemo((): AuthenticatedUser | null => {
        if (!auth0User || !auth0IsAuthenticated) return null;

        // Initialize user with Auth0 data
        let userData: AuthenticatedUser = {
            ...auth0User,
            role: undefined,
            permissions: [],
            organizationId: undefined,
            organizationName: undefined
        };

        // Try to extract custom claims from token
        // This is a synchronous approach - in production, you might want to fetch this from token claims
        try {
            // For now, we'll simulate role extraction from user metadata or email domain
            // In production, this should come from Auth0 custom claims
            const userRole = extractUserRole(auth0User);

            if (userRole) {
                userData = {
                    ...userData,
                    role: userRole,
                    permissions: getRolePermissions(userRole)
                };
            }
        } catch (error) {
            console.error('Error extracting user role:', error);
        }

        return userData;
    }, [auth0User, auth0IsAuthenticated, extractUserRole]);

    // Enhanced authentication state
    const authState = useMemo(() => ({
        user: enhancedUser,
        isAuthenticated: auth0IsAuthenticated && !!enhancedUser,
        isLoading: auth0IsLoading,
        error: auth0Error?.message || null,
        role: enhancedUser?.role || null,
        permissions: enhancedUser?.permissions || []
    }), [enhancedUser, auth0IsAuthenticated, auth0IsLoading, auth0Error]);

    // Enhanced login function
    const login = useCallback(() => {
        loginWithRedirect({
            authorizationParams: {
                redirect_uri: window.location.origin,
                // Request additional scopes for role/organization data
                scope: 'openid profile email read:user_role read:organization'
            }
        });
    }, [loginWithRedirect]);

    // Enhanced logout function
    const logout = useCallback(() => {
        auth0Logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    }, [auth0Logout]);

    // Permission checking functions
    const checkPermission = useCallback((permission: Permission): boolean => {
        return hasPermission(authState.role, permission);
    }, [authState.role]);

    const checkAnyPermission = useCallback((permissions: Permission[]): boolean => {
        return hasAnyPermission(authState.role, permissions);
    }, [authState.role]);

    const checkRole = useCallback((role: UserRole): boolean => {
        return hasRole(authState.role, role);
    }, [authState.role]);

    const checkAnyRole = useCallback((roles: UserRole[]): boolean => {
        return hasAnyRole(authState.role, roles);
    }, [authState.role]);

    // Get user's default route based on role
    const getUserDefaultRoute = useCallback((): string => {
        return getDefaultRoute(authState.role);
    }, [authState.role]);

    return {
        ...authState,
        login,
        logout,
        hasPermission: checkPermission,
        hasAnyPermission: checkAnyPermission,
        hasRole: checkRole,
        hasAnyRole: checkAnyRole,
        getUserDefaultRoute
    };
};

/**
 * Hook to get Auth0 token claims (async)
 * Use this when you need to access token claims directly
 */
export const useAuthClaims = () => {
    const { getIdTokenClaims, isAuthenticated } = useAuth0();

    const getClaims = useCallback(async (): Promise<Auth0CustomClaims | null> => {
        if (!isAuthenticated) return null;

        try {
            const claims = await getIdTokenClaims();
            return claims as Auth0CustomClaims;
        } catch (error) {
            console.error('Error fetching token claims:', error);
            return null;
        }
    }, [getIdTokenClaims, isAuthenticated]);

    return { getClaims };
};

/**
 * Hook for role-based conditional rendering
 * Returns a boolean indicating if the user has the required role/permission
 */
export const useRoleAccess = (
    requiredRoles?: UserRole | UserRole[],
    requiredPermissions?: Permission | Permission[]
) => {
    const { role, hasRole, hasAnyRole, hasPermission, hasAnyPermission } = useAuth();

    const hasAccess = useMemo(() => {
        // Check role requirements
        if (requiredRoles) {
            const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
            if (!hasAnyRole(roles)) return false;
        }

        // Check permission requirements
        if (requiredPermissions) {
            const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
            if (!hasAnyPermission(permissions)) return false;
        }

        return true;
    }, [requiredRoles, requiredPermissions, hasAnyRole, hasAnyPermission]);

    return {
        hasAccess,
        userRole: role,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission
    };
};
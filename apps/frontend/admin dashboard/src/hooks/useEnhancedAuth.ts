/**
 * Enhanced Auth Hook with Backend Integration
 * Extends Auth0 functionality with backend user management
 */

import { useAuth0 } from '@auth0/auth0-react';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { UserRole, Permission } from '../types/auth.types';
import type { UseAuthReturn, AuthenticatedUser } from '../types/auth.types';
import { authService, type EnhancedUserProfile } from '../services/auth.service';
// import { getRolePermissions } from '../utils/permissions';
import { getDefaultRoute } from '../utils/routeAccess';

/**
 * Enhanced authentication hook with backend integration
 */
export const useEnhancedAuth = (): UseAuthReturn => {
    const {
        isAuthenticated: auth0IsAuthenticated,
        isLoading: auth0IsLoading,
        error: auth0Error,
        loginWithRedirect,
        logout: auth0Logout
    } = useAuth0();

    const [backendUser, setBackendUser] = useState<EnhancedUserProfile | null>(null);
    const [isBackendLoading] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('enhancedUser');
        if (stored && auth0IsAuthenticated) {
            try {
                const parsedUser = JSON.parse(stored) as EnhancedUserProfile;
                setBackendUser(parsedUser);
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                localStorage.removeItem('enhancedUser');
            }
        }
    }, [auth0IsAuthenticated]);

    // Map backend user to AuthenticatedUser format
    const enhancedUser = useMemo((): AuthenticatedUser | null => {
        if (!backendUser || !auth0IsAuthenticated) return null;

        return authService.mapToAuthenticatedUser(backendUser);
    }, [backendUser, auth0IsAuthenticated]);

    // Enhanced authentication state
    const authState = useMemo(() => ({
        user: enhancedUser,
        isAuthenticated: auth0IsAuthenticated && !!enhancedUser,
        isLoading: auth0IsLoading || isBackendLoading,
        error: auth0Error?.message || null,
        role: enhancedUser?.role || null,
        permissions: enhancedUser?.permissions || []
    }), [enhancedUser, auth0IsAuthenticated, auth0IsLoading, isBackendLoading, auth0Error]);

    // Enhanced login function
    const login = useCallback(() => {
        loginWithRedirect({
            authorizationParams: {
                redirect_uri: window.location.origin,
                scope: 'openid profile email'
            }
        });
    }, [loginWithRedirect]);

    // Enhanced logout function
    const logout = useCallback(() => {
        // Clear backend user data
        setBackendUser(null);
        localStorage.removeItem('enhancedUser');

        // Logout from Auth0
        auth0Logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    }, [auth0Logout]);

    // Permission checking functions
    const hasPermission = useCallback((permission: Permission): boolean => {
        return authState.permissions.includes(permission);
    }, [authState.permissions]);

    const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
        return permissions.some(p => hasPermission(p));
    }, [hasPermission]);

    const hasRole = useCallback((role: UserRole): boolean => {
        return authState.role === role;
    }, [authState.role]);

    const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
        return authState.role ? roles.includes(authState.role) : false;
    }, [authState.role]);

    // Get user's default route based on role
    const getUserDefaultRoute = useCallback((): string => {
        return getDefaultRoute(authState.role);
    }, [authState.role]);

    // Refresh user data from backend (exported separately)
    // const refreshUser = useCallback(async (): Promise<void> => {
    //     if (!auth0IsAuthenticated) return;

    //     try {
    //         setIsBackendLoading(true);
    //         const accessToken = await getAccessTokenSilently();
    //         const updatedUser = await authService.handleLoginCallback(accessToken);

    //         setBackendUser(updatedUser);
    //         localStorage.setItem('enhancedUser', JSON.stringify(updatedUser));
    //     } catch (error) {
    //         console.error('Failed to refresh user data:', error);
    //     } finally {
    //         setIsBackendLoading(false);
    //     }
    // }, [auth0IsAuthenticated, getAccessTokenSilently]);

    return {
        ...authState,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        hasRole,
        hasAnyRole,
        getUserDefaultRoute
    };
};

/**
 * Hook to get access token for API calls
 */
export const useAccessToken = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const getToken = useCallback(async (): Promise<string | null> => {
        if (!isAuthenticated) return null;

        try {
            return await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'usermng-service',
                    scope: 'openid profile email'
                }
            });
        } catch (error) {
            console.error('Failed to get access token:', error);
            return null;
        }
    }, [getAccessTokenSilently, isAuthenticated]);

    return { getToken };
};

/**
 * Hook for backend user management operations
 */
export const useUserManagement = () => {
    const { getToken } = useAccessToken();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (params: {
        page?: number;
        per_page?: number;
        q?: string;
    } = {}) => {
        try {
            setIsLoading(true);
            setError(null);

            const token = await getToken();
            if (!token) throw new Error('No access token available');

            const result = await authService.fetchUsers(token, params);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    const validateBackendConnection = useCallback(async () => {
        try {
            return await authService.validateBackendConnection();
        } catch (error) {
            console.error('Backend validation failed:', error);
            return false;
        }
    }, []);

    return {
        fetchUsers,
        validateBackendConnection,
        isLoading,
        error
    };
};

// Re-export the original useAuth for backward compatibility
export { useAuth } from './useAuth';

// Export enhanced version as default
export default useEnhancedAuth;
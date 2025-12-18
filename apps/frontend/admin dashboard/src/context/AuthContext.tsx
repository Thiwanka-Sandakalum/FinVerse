/**
 * Enhanced Authentication Context with RBAC Support
 * Provides centralized authentication and authorization state management
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserRole, Permission } from '../types/auth.types';
import type {
    AuthState,
    AuthenticatedUser
} from '../types/auth.types';
import type { RBACState, RBACConfig } from '../types/rbac.types';
import { ROLE_PERMISSIONS, getRolePermissions } from '../utils/permissions';
import { ROUTE_ACCESS, DEFAULT_ROUTES } from '../utils/routeAccess';

// Default RBAC configuration
const DEFAULT_RBAC_CONFIG: RBACConfig = {
    roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
    permissions: Object.values(Permission),
    rolePermissions: ROLE_PERMISSIONS,
    routeAccess: ROUTE_ACCESS,
    defaultRedirects: {
        unauthorized: '/login',
        forbidden: '/403',
        roleBasedHome: DEFAULT_ROUTES
    }
};

// Enhanced Auth Context interface
interface AuthContextType extends AuthState {
    // RBAC state
    rbac: RBACState;

    // Auth actions
    login: () => Promise<void>;
    logout: () => Promise<void>;

    // Permission checking methods
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;

    // Utility methods
    getUserDefaultRoute: () => string;
    refreshUserRole: () => Promise<void>;

    // Configuration
    updateRBACConfig: (config: Partial<RBACConfig>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component props
interface AuthProviderProps {
    children: React.ReactNode;
    rbacConfig?: Partial<RBACConfig>;
}

/**
 * Enhanced Authentication Provider with RBAC support
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({
    children,
    rbacConfig = {}
}) => {
    const {
        user: auth0User,
        isAuthenticated: auth0IsAuthenticated,
        isLoading: auth0IsLoading,
        error: auth0Error,
        loginWithRedirect,
        logout: auth0Logout,
        getIdTokenClaims
    } = useAuth0();

    // Enhanced user state with role information
    const [enhancedUser, setEnhancedUser] = useState<AuthenticatedUser | null>(null);
    const [rbacState, setRBACState] = useState<RBACState>({
        isInitialized: false,
        config: { ...DEFAULT_RBAC_CONFIG, ...rbacConfig },
        userRole: null,
        userPermissions: [],
        isLoading: true,
        error: null
    });

    // Extract user role from Auth0 user data or token claims
    const extractUserRole = async (user: any): Promise<UserRole> => {
        try {
            // Method 1: Try to get role from token claims
            const claims = await getIdTokenClaims();
            if (claims && claims['https://finverse.com/role']) {
                const claimRole = claims['https://finverse.com/role'] as string;
                if (Object.values(UserRole).includes(claimRole as UserRole)) {
                    return claimRole as UserRole;
                }
            }

            // Method 2: Check user metadata
            if (user.user_metadata?.role) {
                return user.user_metadata.role as UserRole;
            }

            // Method 3: Check app metadata
            if (user.app_metadata?.role) {
                return user.app_metadata.role as UserRole;
            }

            // Method 4: Derive from email (fallback for demo)
            if (user.email) {
                if (user.email.includes('superadmin@') || user.email === 'admin@finverse.com') {
                    return UserRole.SUPER_ADMIN;
                }
                if (user.email.includes('admin@') || user.email.includes('manager@')) {
                    return UserRole.ORG_ADMIN;
                }
            }

            // Default role
            return UserRole.MEMBER;
        } catch (error) {
            console.error('Error extracting user role:', error);
            return UserRole.MEMBER; // Safe default
        }
    };

    // Initialize enhanced user data when Auth0 user changes
    useEffect(() => {
        const initializeUser = async () => {
            if (!auth0User || !auth0IsAuthenticated) {
                setEnhancedUser(null);
                setRBACState(prev => ({
                    ...prev,
                    userRole: null,
                    userPermissions: [],
                    isLoading: false
                }));
                return;
            }

            try {
                setRBACState(prev => ({ ...prev, isLoading: true, error: null }));

                // Extract role information
                const userRole = await extractUserRole(auth0User);
                const userPermissions = getRolePermissions(userRole);

                // Create enhanced user object
                const enhanced: AuthenticatedUser = {
                    ...auth0User,
                    role: userRole,
                    permissions: userPermissions,
                    organizationId: auth0User.org_id || undefined,
                    organizationName: auth0User.org_name || undefined
                };

                setEnhancedUser(enhanced);
                setRBACState(prev => ({
                    ...prev,
                    userRole,
                    userPermissions,
                    isLoading: false,
                    isInitialized: true
                }));

            } catch (error) {
                console.error('Error initializing enhanced user:', error);
                setRBACState(prev => ({
                    ...prev,
                    error: 'Failed to initialize user role and permissions',
                    isLoading: false
                }));
            }
        };

        initializeUser();
    }, [auth0User, auth0IsAuthenticated, getIdTokenClaims]);

    // Auth state computed from Auth0 and enhanced user
    const authState: AuthState = {
        user: enhancedUser,
        isAuthenticated: auth0IsAuthenticated && !!enhancedUser,
        isLoading: auth0IsLoading || rbacState.isLoading,
        error: auth0Error?.message || rbacState.error,
        role: enhancedUser?.role || null,
        permissions: enhancedUser?.permissions || []
    };

    // Enhanced login function
    const login = async (): Promise<void> => {
        try {
            await loginWithRedirect({
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    scope: 'openid profile email read:user_role read:organization'
                }
            });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    // Enhanced logout function
    const logout = async (): Promise<void> => {
        try {
            // Clear local state
            setEnhancedUser(null);
            setRBACState(prev => ({
                ...prev,
                userRole: null,
                userPermissions: [],
                isInitialized: false
            }));

            // Logout from Auth0
            auth0Logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    // Permission checking methods
    const hasPermission = (permission: Permission): boolean => {
        return authState.permissions.includes(permission);
    };

    const hasAnyPermission = (permissions: Permission[]): boolean => {
        return permissions.some(p => hasPermission(p));
    };

    const hasAllPermissions = (permissions: Permission[]): boolean => {
        return permissions.every(p => hasPermission(p));
    };

    const hasRole = (role: UserRole): boolean => {
        return authState.role === role;
    };

    const hasAnyRole = (roles: UserRole[]): boolean => {
        return authState.role ? roles.includes(authState.role) : false;
    };

    // Get user's default route based on role
    const getUserDefaultRoute = (): string => {
        if (!authState.role) return '/login';
        return rbacState.config.defaultRedirects.roleBasedHome[authState.role];
    };

    // Refresh user role (useful after role changes)
    const refreshUserRole = async (): Promise<void> => {
        if (auth0User && auth0IsAuthenticated) {
            const newRole = await extractUserRole(auth0User);
            const newPermissions = getRolePermissions(newRole);

            setEnhancedUser(prev => prev ? {
                ...prev,
                role: newRole,
                permissions: newPermissions
            } : null);

            setRBACState(prev => ({
                ...prev,
                userRole: newRole,
                userPermissions: newPermissions
            }));
        }
    };

    // Update RBAC configuration
    const updateRBACConfig = (config: Partial<RBACConfig>): void => {
        setRBACState(prev => ({
            ...prev,
            config: { ...prev.config, ...config }
        }));
    };

    // Context value
    const contextValue: AuthContextType = {
        ...authState,
        rbac: rbacState,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        getUserDefaultRoute,
        refreshUserRole,
        updateRBACConfig
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to use the enhanced Auth context
 */
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

/**
 * Hook to use RBAC-specific functionality
 */
export const useRBAC = () => {
    const { rbac, hasPermission, hasRole, updateRBACConfig } = useAuthContext();
    return {
        ...rbac,
        hasPermission,
        hasRole,
        updateConfig: updateRBACConfig
    };
};

export default AuthProvider;
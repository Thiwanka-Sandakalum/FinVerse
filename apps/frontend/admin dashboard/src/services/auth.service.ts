/**
 * Enhanced Authentication Service
 * Integrates Auth0 with our backend user management API
 */

import { UserRole, Permission } from '../types/auth.types';
import type { AuthenticatedUser } from '../types/auth.types';

// Backend API configuration
const API_BASE_URL = 'http://localhost:3000'; // Your user management service URL

export interface EnhancedUserProfile {
    user_id: string;
    email: string;
    name: string;
    picture?: string;
    app_metadata: {
        org_id?: string;
        role?: 'org_admin' | 'member';
    };
    user_metadata: {
        isCompany?: boolean;
        companyName?: string;
        firstName?: string;
        lastName?: string;
    };
    organization?: {
        id: string;
        name: string;
        display_name: string;
    };
}

export interface LoginCallbackResponse {
    success: boolean;
    user: EnhancedUserProfile;
    message: string;
}

/**
 * Enhanced Authentication Service Class
 */
export class AuthService {
    private static instance: AuthService;
    private apiBaseUrl: string;

    private constructor() {
        this.apiBaseUrl = API_BASE_URL;
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Handle Auth0 login callback with backend integration
     */
    async handleLoginCallback(accessToken: string): Promise<EnhancedUserProfile> {
        try {
            console.log('🔐 Processing login callback with backend...');

            const response = await fetch(`${this.apiBaseUrl}/users/login-callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ token: accessToken })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Backend login failed: ${response.statusText}`);
            }

            const result: LoginCallbackResponse = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Login callback failed');
            }

            console.log('✅ Backend login successful:', result.message);
            return result.user;

        } catch (error) {
            console.error('❌ Login callback failed:', error);
            throw error;
        }
    }

    /**
     * Map backend user profile to frontend auth types
     */
    mapToAuthenticatedUser(backendUser: EnhancedUserProfile): AuthenticatedUser {
        // Map backend roles to frontend roles
        const role = this.mapBackendRole(backendUser.app_metadata.role);

        return {
            ...backendUser,
            role,
            permissions: this.getRolePermissions(role),
            organizationId: backendUser.app_metadata.org_id,
            organizationName: backendUser.organization?.display_name
        };
    }

    /**
     * Map backend roles to frontend role enum
     */
    private mapBackendRole(backendRole?: string): UserRole {
        switch (backendRole) {
            case 'org_admin':
                return UserRole.ORG_ADMIN;
            case 'member':
                return UserRole.MEMBER;
            default:
                // Determine role based on organization existence
                return UserRole.MEMBER;
        }
    }

    /**
     * Get permissions for a role
     */
    private getRolePermissions(role: UserRole): Permission[] {
        switch (role) {
            case UserRole.SUPER_ADMIN:
                return [
                    Permission.VIEW_DASHBOARD,
                    Permission.VIEW_ORGANIZATIONS,
                    Permission.CREATE_ORGANIZATIONS,
                    Permission.EDIT_ORGANIZATIONS,
                    Permission.DELETE_ORGANIZATIONS,
                    Permission.VIEW_USERS,
                    Permission.CREATE_USERS,
                    Permission.EDIT_USERS,
                    Permission.DELETE_USERS,
                    Permission.VIEW_PRODUCTS,
                    Permission.CREATE_PRODUCTS,
                    Permission.EDIT_PRODUCTS,
                    Permission.DELETE_PRODUCTS,
                    Permission.VIEW_ANALYTICS,
                    Permission.VIEW_SETTINGS,
                    Permission.EDIT_SETTINGS
                ];
            case UserRole.ORG_ADMIN:
                return [
                    Permission.VIEW_DASHBOARD,
                    Permission.VIEW_ORGANIZATIONS,
                    Permission.EDIT_ORGANIZATIONS,
                    Permission.VIEW_USERS,
                    Permission.CREATE_USERS,
                    Permission.EDIT_USERS,
                    Permission.DELETE_USERS,
                    Permission.VIEW_PRODUCTS,
                    Permission.CREATE_PRODUCTS,
                    Permission.EDIT_PRODUCTS,
                    Permission.DELETE_PRODUCTS
                ];
            case UserRole.MEMBER:
                return [
                    Permission.VIEW_DASHBOARD,
                    Permission.VIEW_PRODUCTS
                ];
            default:
                return [Permission.VIEW_DASHBOARD];
        }
    }

    /**
     * Fetch enhanced user list from backend
     */
    async fetchUsers(accessToken: string, params: {
        page?: number;
        per_page?: number;
        q?: string;
    } = {}): Promise<{ users: EnhancedUserProfile[]; pagination?: any }> {
        try {
            const queryString = new URLSearchParams(
                Object.entries(params).reduce((acc, [key, value]) => {
                    if (value !== undefined) acc[key] = String(value);
                    return acc;
                }, {} as Record<string, string>)
            ).toString();

            const response = await fetch(`${this.apiBaseUrl}/users?${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.statusText}`);
            }

            const data = await response.json();

            // Handle both paginated and non-paginated responses
            if (data.users) {
                return {
                    users: data.users,
                    pagination: data.pagination
                };
            } else if (Array.isArray(data)) {
                return { users: data };
            }

            return { users: [] };

        } catch (error) {
            console.error('Failed to fetch users from backend:', error);
            throw error;
        }
    }

    /**
     * Validate if backend is accessible
     */
    async validateBackendConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/users?per_page=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.status < 500; // Accept any response that's not a server error
        } catch (error) {
            console.error('Backend connection validation failed:', error);
            return false;
        }
    }

    /**
     * Set API base URL (for configuration)
     */
    setApiBaseUrl(url: string): void {
        this.apiBaseUrl = url;
    }

    /**
     * Get current API base URL
     */
    getApiBaseUrl(): string {
        return this.apiBaseUrl;
    }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export default instance
export default authService;
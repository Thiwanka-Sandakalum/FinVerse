/**
 * Frontend Integration Example for Enhanced User Management API
 * 
 * This example shows how to integrate the enhanced user management API
 * with a React frontend using Auth0 for authentication.
 */

// auth-service.ts - Auth0 integration service
import { Auth0Client } from '@auth0/spa-js';

class AuthService {
    private auth0Client: Auth0Client;
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
        this.auth0Client = new Auth0Client({
            domain: process.env.REACT_APP_AUTH0_DOMAIN!,
            clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            redirectUri: window.location.origin
        });
    }

    /**
     * Handle login and process callback
     */
    async handleAuth0Callback(): Promise<UserProfile | null> {
        try {
            // Get access token from Auth0
            const accessToken = await this.auth0Client.getTokenSilently();

            // Call our backend login callback endpoint
            const response = await fetch(`${this.apiBaseUrl}/users/login-callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ token: accessToken })
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ Login successful:', result.message);

                // Store user data
                localStorage.setItem('userProfile', JSON.stringify(result.user));
                localStorage.setItem('accessToken', accessToken);

                return result.user;
            } else {
                console.error('❌ Login callback failed:', result.message);
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Auth callback error:', error);
            throw error;
        }
    }

    /**
     * Get current user profile
     */
    getCurrentUser(): UserProfile | null {
        const stored = localStorage.getItem('userProfile');
        return stored ? JSON.parse(stored) : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getCurrentUser();
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: 'org_admin' | 'member'): boolean {
        const user = this.getCurrentUser();
        return user?.app_metadata?.role === role;
    }

    /**
     * Check if user belongs to an organization
     */
    hasOrganization(): boolean {
        const user = this.getCurrentUser();
        return !!user?.app_metadata?.org_id;
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('accessToken');
        this.auth0Client.logout({
            returnTo: window.location.origin
        });
    }

    /**
     * Get stored access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}

// types.ts - TypeScript type definitions
interface UserProfile {
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

// api-service.ts - API service for user management
class UserManagementAPI {
    private baseUrl: string;
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
        this.authService = authService;
    }

    /**
     * Get authenticated headers
     */
    private getAuthHeaders(): HeadersInit {
        const token = this.authService.getAccessToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    /**
     * List all users (admin only)
     */
    async listUsers(params: {
        page?: number;
        per_page?: number;
        q?: string;
    } = {}): Promise<{ users: UserProfile[]; pagination: any }> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined) acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await fetch(`${this.baseUrl}/users?${queryString}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<UserProfile> {
        const response = await fetch(`${this.baseUrl}/users/${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Update user metadata
     */
    async updateUser(userId: string, updates: {
        name?: string;
        metadata?: Record<string, any>;
        picture?: string;
    }): Promise<UserProfile> {
        const response = await fetch(`${this.baseUrl}/users/${encodeURIComponent(userId)}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.statusText}`);
        }

        return response.json();
    }
}

// React component example
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const authService = new AuthService();
    const apiService = new UserManagementAPI(authService);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check if user is already authenticated
                let currentUser = authService.getCurrentUser();

                // If not authenticated, handle Auth0 callback
                if (!currentUser) {
                    currentUser = await authService.handleAuth0Callback();
                }

                setUser(currentUser);

                // Load users if user is org admin
                if (currentUser?.app_metadata?.role === 'org_admin') {
                    const usersData = await apiService.listUsers({ per_page: 50 });
                    setUsers(usersData.users);
                }
            } catch (error) {
                console.error('Authentication failed:', error);
                // Redirect to login
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const handleLogout = () => {
        authService.logout();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Not authenticated</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            {/* User Profile */}
            <div>
                <h2>Welcome, {user.name}!</h2>
                <p>Role: {user.app_metadata.role}</p>
                {user.organization && (
                    <p>Organization: {user.organization.display_name}</p>
                )}
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* Admin Features */}
            {user.app_metadata.role === 'org_admin' && (
                <div>
                    <h3>Organization Users</h3>
                    <ul>
                        {users.map(u => (
                            <li key={u.user_id}>
                                {u.name} ({u.email}) - {u.app_metadata.role}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Member Features */}
            {user.app_metadata.role === 'member' && (
                <div>
                    <h3>Member Dashboard</h3>
                    <p>Welcome to your member dashboard!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

// Environment variables for React app (.env)
/*
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-spa-client-id
REACT_APP_AUTH0_AUDIENCE=https://your-api-identifier
REACT_APP_API_BASE_URL=http://localhost:3000
*/
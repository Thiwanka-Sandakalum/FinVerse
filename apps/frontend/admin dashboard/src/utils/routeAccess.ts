/**
 * Route Access Configuration and Validation Utilities
 * This file defines which routes are accessible to which roles
 */

import { UserRole, Permission } from '../types/auth.types';
import type { RouteAccess, PermissionCheckResult } from '../types/auth.types';
import { hasAnyRole, hasAnyPermission } from './permissions';

// Route access configuration based on role requirements
export const ROUTE_ACCESS: Record<string, RouteAccess> = {
    // Public dashboard - accessible to all authenticated users
    '/dashboard': {
        path: '/dashboard',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
        redirectTo: '/dashboard'
    },

    // Organizations routes - super_admin and org_admin only
    '/organizations': {
        path: '/organizations',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
        redirectTo: '/dashboard'
    },
    '/organizations/:id': {
        path: '/organizations/:id',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
        redirectTo: '/dashboard'
    },
    '/organizations/create': {
        path: '/organizations/create',
        allowedRoles: [UserRole.SUPER_ADMIN], // Only super_admin can create organizations
        redirectTo: '/organizations'
    },

    // User management routes - super_admin and org_admin only
    '/users': {
        path: '/users',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
        redirectTo: '/dashboard'
    },
    '/users/:id': {
        path: '/users/:id',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
        redirectTo: '/users'
    },
    '/users/create': {
        path: '/users/create',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN], // Both super_admin and org_admin can create users
        redirectTo: '/users'
    },

    // Product management routes - accessible to all roles (members can manage products)
    '/products': {
        path: '/products',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
        redirectTo: '/dashboard'
    },
    '/products/:id': {
        path: '/products/:id',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
        redirectTo: '/products'
    },
    '/products/create': {
        path: '/products/create',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
        redirectTo: '/products'
    },

    // Analytics routes - super_admin only
    '/analytics': {
        path: '/analytics',
        allowedRoles: [UserRole.SUPER_ADMIN],
        redirectTo: '/dashboard'
    },

    // Settings routes - super_admin only
    '/settings': {
        path: '/settings',
        allowedRoles: [UserRole.SUPER_ADMIN],
        redirectTo: '/dashboard'
    },

    // Profile routes - role-based access
    '/profile/organization': {
        path: '/profile/organization',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
        redirectTo: '/profile/user'
    },
    '/profile/user': {
        path: '/profile/user',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
        redirectTo: '/dashboard'
    }
};

// Role-based default routes (where to redirect users after login)
export const DEFAULT_ROUTES: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: '/dashboard',
    [UserRole.ORG_ADMIN]: '/dashboard',
    [UserRole.MEMBER]: '/products' // Members go straight to products
};

// Check if a user has access to a specific route
export const checkRouteAccess = (
    path: string,
    userRole: UserRole | null,
    userPermissions: Permission[] = []
): PermissionCheckResult => {
    // If user is not authenticated, deny access
    if (!userRole) {
        return {
            hasAccess: false,
            redirectTo: '/login'
        };
    }

    // Find matching route configuration (exact match first, then pattern match)
    let routeConfig = ROUTE_ACCESS[path];

    // If no exact match, try pattern matching for dynamic routes
    if (!routeConfig) {
        const matchingRoute = Object.keys(ROUTE_ACCESS).find(routePath => {
            // Convert route patterns like '/users/:id' to regex
            const pattern = routePath.replace(/:[^/]+/g, '[^/]+');
            const regex = new RegExp(`^${pattern}$`);
            return regex.test(path);
        });

        if (matchingRoute) {
            routeConfig = ROUTE_ACCESS[matchingRoute];
        }
    }

    // If no route configuration found, allow access (fallback behavior)
    if (!routeConfig) {
        console.warn(`No route configuration found for path: ${path}`);
        return { hasAccess: true };
    }

    // Check role-based access
    const hasRoleAccess = hasAnyRole(userRole, routeConfig.allowedRoles);

    // Check permission-based access (if required permissions are specified)
    const hasPermissionAccess = routeConfig.requiredPermissions
        ? hasAnyPermission(userRole, routeConfig.requiredPermissions)
        : true;

    const hasAccess = hasRoleAccess && hasPermissionAccess;

    if (!hasAccess) {
        return {
            hasAccess: false,
            redirectTo: routeConfig.redirectTo || DEFAULT_ROUTES[userRole],
            requiredRole: routeConfig.allowedRoles[0], // Show the minimum required role
            missingPermissions: routeConfig.requiredPermissions
        };
    }

    return { hasAccess: true };
};

// Get the appropriate default route for a user role
export const getDefaultRoute = (userRole: UserRole | null): string => {
    if (!userRole) return '/login';
    return DEFAULT_ROUTES[userRole];
};

// Check if current route matches a pattern (for dynamic routes)
export const matchesRoute = (currentPath: string, routePattern: string): boolean => {
    const pattern = routePattern.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(currentPath);
};

// Get all accessible routes for a user role
export const getAccessibleRoutes = (userRole: UserRole | null): string[] => {
    if (!userRole) return [];

    return Object.values(ROUTE_ACCESS)
        .filter(route => hasAnyRole(userRole, route.allowedRoles))
        .map(route => route.path);
};

// Validate if a path is a valid application route
export const isValidRoute = (path: string): boolean => {
    const allRoutes = Object.keys(ROUTE_ACCESS);
    return allRoutes.includes(path) || allRoutes.some(route => matchesRoute(path, route));
};

// Get route breadcrumbs with access checking
export const getRouteBreadcrumbs = (
    path: string,
    userRole: UserRole | null
): { label: string; path: string; accessible: boolean }[] => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: { label: string; path: string; accessible: boolean }[] = [];

    // Add dashboard as root
    breadcrumbs.push({
        label: 'Dashboard',
        path: '/dashboard',
        accessible: checkRouteAccess('/dashboard', userRole).hasAccess
    });

    // Build breadcrumb path
    let currentPath = '';
    segments.forEach(segment => {
        currentPath += `/${segment}`;
        const isAccessible = checkRouteAccess(currentPath, userRole).hasAccess;

        // Convert segment to human readable label
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);

        breadcrumbs.push({
            label,
            path: currentPath,
            accessible: isAccessible
        });
    });

    return breadcrumbs;
};

// Route access utility for React Router guards
export const createRouteGuard = (userRole: UserRole | null, userPermissions: Permission[] = []) => {
    return (path: string) => checkRouteAccess(path, userRole, userPermissions);
};
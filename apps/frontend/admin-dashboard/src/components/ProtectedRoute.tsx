/**
 * Protected Route Component
 * Wraps routes that require specific permissions or roles
 */

import React from 'react';
import { usePermission } from '@/src/hooks/usePermission';
import { UserRole, PermissionAction } from '@/src/types/rbac.types';
import { AccessDenied } from './AccessDenied';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: UserRole[];
    requiredPermission?: {
        resource: string;
        action: PermissionAction;
    };
    fallback?: React.ReactNode;
}

/**
 * HOC to protect routes based on role or permission
 * Usage:
 *   <ProtectedRoute requiredRole={[UserRole.SUPER_ADMIN]}>
 *     <OrganizationsPage />
 *   </ProtectedRoute>
 *
 *   <ProtectedRoute requiredPermission={{ resource: 'users', action: 'manage' }}>
 *     <UserManagement />
 *   </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    requiredPermission,
    fallback
}) => {
    const { userRole, can } = usePermission();

    // Check role requirement
    if (requiredRole && !requiredRole.includes(userRole)) {
        return fallback ? (
            <>{fallback}</>
        ) : (
            <AccessDenied resource={`${requiredRole.join(' or ')} role`} />
        );
    }

    // Check permission requirement
    if (
        requiredPermission &&
        !can(requiredPermission.resource, requiredPermission.action)
    ) {
        return fallback ? (
            <>{fallback}</>
        ) : (
            <AccessDenied
                resource={requiredPermission.resource}
                action={requiredPermission.action}
            />
        );
    }

    return <>{children}</>;
};

/**
 * Wrapper component for resources that should only show conditionally
 * Usage:
 *   <ConditionalRender can="view" resource="users">
 *     <UsersSection />
 *   </ConditionalRender>
 */
interface ConditionalRenderProps {
    can: PermissionAction;
    resource: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
    can: action,
    resource,
    children,
    fallback
}) => {
    const { can } = usePermission();

    if (!can(resource, action)) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
};

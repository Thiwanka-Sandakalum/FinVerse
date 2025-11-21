/**
 * RoleGuard Component
 * Provides component-level access control based on user roles
 * Conditionally renders children based on role requirements
 */

import React from 'react';
import { Alert, Text, Stack } from '@mantine/core';
import { IconLock, IconInfoCircle } from '@tabler/icons-react';
import { UserRole } from '../../types/auth.types';
import type { RoleGuardProps } from '../../types/auth.types';
import { useAuth } from '../../hooks/useAuth';
import { getRoleDisplayName, getRoleColor } from '../../utils/permissions';

/**
 * Component that conditionally renders content based on user roles
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
    allowedRoles,
    fallback,
    children
}) => {
    const { role, hasAnyRole } = useAuth();

    // Normalize allowedRoles to array
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Check if user has required role
    if (!role || !hasAnyRole(rolesArray)) {
        // If custom fallback is provided, render it
        if (fallback) {
            return <>{fallback}</>;
        }

        // Default fallback - show access restriction message
        return (
            <Alert
                icon={<IconLock size="1rem" />}
                title="Access Restricted"
                color="orange"
                variant="light"
            >
                <Stack gap="xs">
                    <Text size="sm">
                        This feature is restricted to specific roles.
                    </Text>
                    {role && (
                        <Text size="sm" c="dimmed">
                            Your role: <strong style={{ color: `var(--mantine-color-${getRoleColor(role)}-6)` }}>
                                {getRoleDisplayName(role)}
                            </strong>
                        </Text>
                    )}
                    <Text size="sm" c="dimmed">
                        Required role(s): {rolesArray.map(r => getRoleDisplayName(r)).join(', ')}
                    </Text>
                </Stack>
            </Alert>
        );
    }

    // User has required role, render children
    return <>{children}</>;
};

/**
 * Silent role guard - doesn't render anything if access is denied
 */
export const SilentRoleGuard: React.FC<RoleGuardProps> = ({
    allowedRoles,
    children
}) => {
    const { role, hasAnyRole } = useAuth();
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!role || !hasAnyRole(rolesArray)) {
        return null; // Render nothing if access denied
    }

    return <>{children}</>;
};

/**
 * Role-based conditional wrapper with informative messaging
 */
export const RoleInfo: React.FC<{
    allowedRoles: UserRole | UserRole[];
    children: React.ReactNode;
    showInfo?: boolean;
}> = ({ allowedRoles, children, showInfo = false }) => {
    const { role, hasAnyRole } = useAuth();
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!role || !hasAnyRole(rolesArray)) {
        return showInfo ? (
            <Alert
                icon={<IconInfoCircle size="1rem" />}
                title="Feature Available with Higher Role"
                color="blue"
                variant="light"
            >
                <Text size="sm">
                    This feature becomes available with: {rolesArray.map(r => getRoleDisplayName(r)).join(' or ')}
                </Text>
            </Alert>
        ) : null;
    }

    return <>{children}</>;
};

/**
 * Pre-built role guards for common use cases
 */
export const SuperAdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <RoleGuard allowedRoles={UserRole.SUPER_ADMIN} fallback={fallback}>
        {children}
    </RoleGuard>
);

export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]} fallback={fallback}>
        {children}
    </RoleGuard>
);

export const MemberAndAbove: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER]} fallback={fallback}>
        {children}
    </RoleGuard>
);

/**
 * Role exclusion guard - renders children only if user does NOT have specified roles
 */
export const RoleExclude: React.FC<{
    excludedRoles: UserRole | UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}> = ({ excludedRoles, children, fallback }) => {
    const { role, hasAnyRole } = useAuth();
    const rolesArray = Array.isArray(excludedRoles) ? excludedRoles : [excludedRoles];

    if (role && hasAnyRole(rolesArray)) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
};

/**
 * Role comparison utilities for template usage
 */
export const useRoleComparison = () => {
    const { role } = useAuth();

    return {
        isSuperAdmin: role === UserRole.SUPER_ADMIN,
        isOrgAdmin: role === UserRole.ORG_ADMIN,
        isMember: role === UserRole.MEMBER,
        isAdminOrAbove: role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN,
        role
    };
};

export default RoleGuard;
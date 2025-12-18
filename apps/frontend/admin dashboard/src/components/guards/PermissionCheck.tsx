/**
 * PermissionCheck Component
 * Provides component-level access control based on user permissions
 * Conditionally renders children based on permission requirements
 */

import React from 'react';
import { Alert, Text, Stack, Badge, Group } from '@mantine/core';
import { IconLock, IconKey, IconInfoCircle } from '@tabler/icons-react';
import { Permission } from '../../types/auth.types';
import type { PermissionCheckProps } from '../../types/auth.types';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import { getRoleDisplayName, getRoleColor } from '../../utils/permissions';

/**
 * Component that conditionally renders content based on user permissions
 */
export const PermissionCheck: React.FC<PermissionCheckProps> = ({
    permission,
    requireAll = false,
    fallback,
    children
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
    const { role } = useAuth();

    // Normalize permissions to array
    const permissionsArray = Array.isArray(permission) ? permission : [permission];

    // Check permissions based on requireAll flag
    const hasAccess = requireAll
        ? hasAllPermissions(permissionsArray)
        : hasAnyPermission(permissionsArray);

    // If user doesn't have required permissions
    if (!hasAccess) {
        // If custom fallback is provided, render it
        if (fallback) {
            return <>{fallback}</>;
        }

        // Default fallback - show permission restriction message
        return (
            <Alert
                icon={<IconKey size="1rem" />}
                title="Permission Required"
                color="yellow"
                variant="light"
            >
                <Stack gap="xs">
                    <Text size="sm">
                        You need additional permissions to access this feature.
                    </Text>

                    {role && (
                        <Group gap="xs">
                            <Text size="sm" c="dimmed">Your role:</Text>
                            <Badge
                                color={getRoleColor(role)}
                                variant="light"
                                size="sm"
                            >
                                {getRoleDisplayName(role)}
                            </Badge>
                        </Group>
                    )}

                    <div>
                        <Text size="sm" c="dimmed" mb={4}>
                            Required permission(s):
                        </Text>
                        <Group gap="xs">
                            {permissionsArray.map((perm) => (
                                <Badge
                                    key={perm}
                                    variant="outline"
                                    color="gray"
                                    size="xs"
                                    leftSection={<IconLock size="0.6rem" />}
                                >
                                    {perm.replace(/_/g, ' ').toLowerCase()}
                                </Badge>
                            ))}
                        </Group>
                    </div>

                    {requireAll && permissionsArray.length > 1 && (
                        <Text size="xs" c="dimmed" fs="italic">
                            All permissions above are required
                        </Text>
                    )}
                </Stack>
            </Alert>
        );
    }

    // User has required permissions, render children
    return <>{children}</>;
};

/**
 * Silent permission check - doesn't render anything if access is denied
 */
export const SilentPermissionCheck: React.FC<PermissionCheckProps> = ({
    permission,
    requireAll = false,
    children
}) => {
    const { hasAnyPermission, hasAllPermissions } = usePermissions();
    const permissionsArray = Array.isArray(permission) ? permission : [permission];

    const hasAccess = requireAll
        ? hasAllPermissions(permissionsArray)
        : hasAnyPermission(permissionsArray);

    if (!hasAccess) {
        return null; // Render nothing if access denied
    }

    return <>{children}</>;
};

/**
 * Permission info component - shows informative message about required permissions
 */
export const PermissionInfo: React.FC<{
    permission: Permission | Permission[];
    children: React.ReactNode;
    showInfo?: boolean;
}> = ({ permission, children, showInfo = false }) => {
    const { hasAnyPermission, hasAllPermissions } = usePermissions();
    const permissionsArray = Array.isArray(permission) ? permission : [permission];

    const hasAccess = hasAnyPermission(permissionsArray);

    if (!hasAccess) {
        return showInfo ? (
            <Alert
                icon={<IconInfoCircle size="1rem" />}
                title="Feature Requires Permissions"
                color="blue"
                variant="light"
            >
                <Stack gap="xs">
                    <Text size="sm">
                        Contact your administrator to request access to this feature.
                    </Text>
                    <Group gap="xs">
                        {permissionsArray.map((perm) => (
                            <Badge key={perm} variant="outline" color="blue" size="xs">
                                {perm.replace(/_/g, ' ').toLowerCase()}
                            </Badge>
                        ))}
                    </Group>
                </Stack>
            </Alert>
        ) : null;
    }

    return <>{children}</>;
};

/**
 * Pre-built permission guards for common use cases
 */

// Organization permissions
export const CanViewOrganizations: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.VIEW_ORGANIZATIONS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

export const CanCreateOrganizations: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.CREATE_ORGANIZATIONS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

export const CanEditOrganizations: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.EDIT_ORGANIZATIONS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

// User management permissions
export const CanViewUsers: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.VIEW_USERS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

export const CanCreateUsers: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.CREATE_USERS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

// Product management permissions
export const CanViewProducts: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.VIEW_PRODUCTS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

export const CanCreateProducts: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.CREATE_PRODUCTS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

// Analytics and Settings permissions
export const CanViewAnalytics: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.VIEW_ANALYTICS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

export const CanViewSettings: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback
}) => (
    <PermissionCheck permission={Permission.VIEW_SETTINGS} fallback={fallback}>
        {children}
    </PermissionCheck>
);

/**
 * Composite permission checker for multiple conditions
 */
export const MultiPermissionCheck: React.FC<{
    conditions: {
        permission: Permission | Permission[];
        requireAll?: boolean;
    }[];
    operator?: 'AND' | 'OR';
    children: React.ReactNode;
    fallback?: React.ReactNode;
}> = ({ conditions, operator = 'OR', children, fallback }) => {
    const { hasAnyPermission, hasAllPermissions } = usePermissions();

    const results = conditions.map(condition => {
        const permissionsArray = Array.isArray(condition.permission) ? condition.permission : [condition.permission];
        return condition.requireAll
            ? hasAllPermissions(permissionsArray)
            : hasAnyPermission(permissionsArray);
    });

    const hasAccess = operator === 'AND'
        ? results.every(result => result)
        : results.some(result => result);

    if (!hasAccess) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
};

export default PermissionCheck;
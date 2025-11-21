/**
 * ProtectedRoute Component
 * Provides route-level access control based on user roles and permissions
 */

import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Container, Alert, Button, Stack, Title, Text, Group } from '@mantine/core';
import { IconLock, IconArrowLeft, IconHome } from '@tabler/icons-react';
import { UserRole, Permission } from '../../types/auth.types';
import type { ProtectedRouteProps } from '../../types/auth.types';
import { useAuth } from '../../hooks/useAuth';
import { checkRouteAccess } from '../../utils/routeAccess';
import { getRoleDisplayName, getRoleColor } from '../../utils/permissions';

/**
 * ProtectedRoute wrapper component that checks user access before rendering children
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    allowedRoles,
    requiredPermissions,
    fallback,
    redirectTo,
    children
}) => {
    const { user, isAuthenticated, isLoading, role, hasAnyRole, hasAnyPermission } = useAuth();
    const location = useLocation();

    // Show loading state while authentication is being determined
    if (isLoading) {
        return (
            <Container size="sm" py="xl">
                <Stack align="center" gap="md">
                    <Text>Verifying access...</Text>
                </Stack>
            </Container>
        );
    }

    // Redirect to login if user is not authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check route access using our utility function
    const accessResult = checkRouteAccess(location.pathname, role);

    // If we have specific role requirements, check those
    if (allowedRoles && !hasAnyRole(allowedRoles)) {
        return renderAccessDenied('role', allowedRoles, requiredPermissions, fallback, redirectTo);
    }

    // If we have specific permission requirements, check those
    if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
        return renderAccessDenied('permission', allowedRoles, requiredPermissions, fallback, redirectTo);
    }

    // If route access check failed, handle accordingly
    if (!accessResult.hasAccess) {
        if (redirectTo) {
            return <Navigate to={redirectTo} replace />;
        }
        if (accessResult.redirectTo) {
            return <Navigate to={accessResult.redirectTo} replace />;
        }
        return renderAccessDenied('route', allowedRoles, requiredPermissions, fallback, redirectTo);
    }

    // All checks passed, render the protected content
    return <>{children}</>;
};

/**
 * Renders access denied UI
 */
const renderAccessDenied = (
    reason: 'role' | 'permission' | 'route',
    allowedRoles?: UserRole[],
    requiredPermissions?: Permission[],
    fallback?: React.ReactNode,
    redirectTo?: string
) => {
    const { role } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // If custom fallback is provided, use it
    if (fallback) {
        return <>{fallback}</>;
    }

    // If redirect is specified, redirect immediately
    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    // Default access denied UI
    return (
        <Container size="sm" py="xl">
            <Stack align="center" gap="lg">
                <IconLock size={64} color="var(--mantine-color-red-6)" />

                <Title order={2} ta="center">Access Denied</Title>

                <Alert
                    icon={<IconLock size="1rem" />}
                    title="Insufficient Permissions"
                    color="red"
                    variant="light"
                >
                    <Stack gap="sm">
                        <Text size="sm">
                            You don't have the required permissions to access this page.
                        </Text>

                        {role && (
                            <Text size="sm" c="dimmed">
                                Your current role: <strong style={{ color: `var(--mantine-color-${getRoleColor(role)}-6)` }}>
                                    {getRoleDisplayName(role)}
                                </strong>
                            </Text>
                        )}

                        {reason === 'role' && allowedRoles && (
                            <Text size="sm" c="dimmed">
                                Required role(s): {allowedRoles.map(r => getRoleDisplayName(r)).join(', ')}
                            </Text>
                        )}

                        {reason === 'permission' && requiredPermissions && (
                            <Text size="sm" c="dimmed">
                                Required permission(s): {requiredPermissions.join(', ')}
                            </Text>
                        )}
                    </Stack>
                </Alert>

                <Group gap="md">
                    <Button
                        leftSection={<IconArrowLeft size="1rem" />}
                        variant="light"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>

                    <Button
                        leftSection={<IconHome size="1rem" />}
                        onClick={() => navigate('/dashboard')}
                    >
                        Go to Dashboard
                    </Button>
                </Group>

                <Text size="xs" c="dimmed" ta="center">
                    If you believe this is an error, please contact your administrator.
                </Text>
            </Stack>
        </Container>
    );
};

/**
 * Higher-order component that wraps routes with protection
 */
export const withRoleProtection = (
    Component: React.ComponentType<any>,
    allowedRoles: UserRole[],
    requiredPermissions?: Permission[]
) => {
    return (props: any) => (
        <ProtectedRoute allowedRoles={allowedRoles} requiredPermissions={requiredPermissions}>
            <Component {...props} />
        </ProtectedRoute>
    );
};

/**
 * Route protection helper for specific roles
 */
export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
        {children}
    </ProtectedRoute>
);

export const OrgAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
        {children}
    </ProtectedRoute>
);

export const MemberRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER]}>
        {children}
    </ProtectedRoute>
);

export default ProtectedRoute;
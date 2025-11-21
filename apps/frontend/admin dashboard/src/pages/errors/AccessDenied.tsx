/**
 * AccessDenied Page
 * Dedicated page for handling unauthorized access scenarios
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Stack,
    Title,
    Text,
    Button,
    Group,
    Alert,
    Badge,
    Card,
    List,
    Divider,
    ActionIcon
} from '@mantine/core';
import {
    IconLock,
    IconArrowLeft,
    IconHome,
    IconMail,
    IconShield,
    IconUser,
    IconRefresh
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { getRoleDisplayName, getRoleColor } from '../../utils/permissions';
import { getDefaultRoute } from '../../utils/routeAccess';

interface AccessDeniedProps {
    title?: string;
    message?: string;
    showRoleInfo?: boolean;
    showSuggestions?: boolean;
    allowRefresh?: boolean;
}

/**
 * Comprehensive access denied page with role-specific guidance
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
    title = "Access Denied",
    message = "You don't have permission to access this resource.",
    showRoleInfo = true,
    showSuggestions = true,
    allowRefresh = false
}) => {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigate('/dashboard');
        }
    };

    const handleGoHome = () => {
        const defaultRoute = role ? getDefaultRoute(role) : '/dashboard';
        navigate(defaultRoute);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const getRoleSuggestions = () => {
        switch (role) {
            case 'member':
                return [
                    'You can access Product Management features',
                    'Contact your organization administrator for additional permissions',
                    'Review the product catalog and create new products'
                ];
            case 'org_admin':
                return [
                    'You have access to Organization and User Management',
                    'Product Management features are fully available',
                    'Analytics and Settings require Super Admin privileges'
                ];
            case 'super_admin':
                return [
                    'You have full system access',
                    'This might be a temporary issue - try refreshing the page',
                    'Check if the requested resource exists'
                ];
            default:
                return [
                    'Please log in to access this resource',
                    'Contact support if you continue to experience issues'
                ];
        }
    };

    return (
        <Container size="md" py="xl">
            <Stack align="center" gap="xl">
                {/* Header Section */}
                <Stack align="center" gap="md">
                    <div style={{
                        padding: '2rem',
                        borderRadius: '50%',
                        backgroundColor: 'var(--mantine-color-red-1)',
                        border: '3px solid var(--mantine-color-red-3)'
                    }}>
                        <IconLock size={48} color="var(--mantine-color-red-6)" />
                    </div>

                    <Title order={1} ta="center" c="red.7">
                        {title}
                    </Title>

                    <Text size="lg" ta="center" c="dimmed" maw={500}>
                        {message}
                    </Text>
                </Stack>

                {/* User Role Information */}
                {showRoleInfo && user && role && (
                    <Card withBorder padding="lg" radius="md" w="100%" maw={500}>
                        <Stack gap="md">
                            <Group justify="space-between">
                                <Text fw={600} size="sm">Your Account Information</Text>
                                <IconUser size="1.2rem" />
                            </Group>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">User:</Text>
                                <Text size="sm" fw={500}>{user.name || user.email}</Text>
                            </Group>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Role:</Text>
                                <Badge
                                    color={getRoleColor(role)}
                                    variant="filled"
                                    leftSection={<IconShield size="0.8rem" />}
                                >
                                    {getRoleDisplayName(role)}
                                </Badge>
                            </Group>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Requested Path:</Text>
                                <Text size="sm" ff="monospace" c="dimmed">{location.pathname}</Text>
                            </Group>
                        </Stack>
                    </Card>
                )}

                {/* Error Details */}
                <Alert
                    icon={<IconLock size="1rem" />}
                    title="Access Restriction Details"
                    color="red"
                    variant="light"
                    w="100%"
                    maw={500}
                >
                    <Stack gap="xs">
                        <Text size="sm">
                            The resource you're trying to access requires additional permissions.
                        </Text>
                        {role && (
                            <Text size="sm" c="dimmed">
                                Your current role ({getRoleDisplayName(role)}) doesn't have access to this feature.
                            </Text>
                        )}
                    </Stack>
                </Alert>

                {/* Role-specific suggestions */}
                {showSuggestions && role && (
                    <Card withBorder padding="lg" radius="md" w="100%" maw={500}>
                        <Stack gap="md">
                            <Text fw={600} size="sm">What you can do:</Text>
                            <List
                                spacing="xs"
                                size="sm"
                                icon={<Text c="blue">•</Text>}
                            >
                                {getRoleSuggestions().map((suggestion, index) => (
                                    <List.Item key={index}>
                                        <Text size="sm">{suggestion}</Text>
                                    </List.Item>
                                ))}
                            </List>
                        </Stack>
                    </Card>
                )}

                <Divider w="100%" maw={500} />

                {/* Action Buttons */}
                <Group gap="md" justify="center">
                    <Button
                        leftSection={<IconArrowLeft size="1rem" />}
                        variant="light"
                        onClick={handleGoBack}
                    >
                        Go Back
                    </Button>

                    <Button
                        leftSection={<IconHome size="1rem" />}
                        onClick={handleGoHome}
                    >
                        {role === 'member' ? 'Go to Products' : 'Go to Dashboard'}
                    </Button>

                    {allowRefresh && (
                        <ActionIcon
                            variant="light"
                            size="lg"
                            onClick={handleRefresh}
                            title="Refresh page"
                        >
                            <IconRefresh size="1rem" />
                        </ActionIcon>
                    )}
                </Group>

                {/* Support Contact */}
                <Card withBorder padding="md" radius="md" w="100%" maw={500} bg="gray.0">
                    <Stack gap="xs">
                        <Group gap="xs">
                            <IconMail size="1rem" />
                            <Text size="sm" fw={500}>Need Help?</Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                            If you believe this is an error or need additional permissions,
                            contact your system administrator or support team.
                        </Text>
                        <Group gap="md" mt="xs">
                            <Button
                                size="xs"
                                variant="subtle"
                                leftSection={<IconMail size="0.8rem" />}
                                component="a"
                                href="mailto:support@finverse.com"
                            >
                                Contact Support
                            </Button>
                            <Button
                                size="xs"
                                variant="subtle"
                                color="red"
                                onClick={() => logout()}
                            >
                                Sign Out
                            </Button>
                        </Group>
                    </Stack>
                </Card>

                {/* Footer */}
                <Text size="xs" c="dimmed" ta="center" mt="xl">
                    FinVerse Admin Dashboard • Access Control System
                </Text>
            </Stack>
        </Container>
    );
};

/**
 * Quick access denied component for inline use
 */
export const QuickAccessDenied: React.FC<{
    message?: string;
    compact?: boolean;
}> = ({
    message = "Access denied",
    compact = false
}) => {
        const { role } = useAuth();

        if (compact) {
            return (
                <Alert
                    icon={<IconLock size="0.9rem" />}
                    color="red"
                    variant="light"
                >
                    <Text size="sm">{message}</Text>
                </Alert>
            );
        }

        return (
            <Card withBorder padding="lg" radius="md">
                <Stack align="center" gap="md">
                    <IconLock size={32} color="var(--mantine-color-red-6)" />
                    <Text size="sm" ta="center">{message}</Text>
                    {role && (
                        <Badge color={getRoleColor(role)} variant="light" size="sm">
                            Current role: {getRoleDisplayName(role)}
                        </Badge>
                    )}
                </Stack>
            </Card>
        );
    };

export default AccessDenied;
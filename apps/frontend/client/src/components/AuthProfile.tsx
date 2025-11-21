/**
 * Auth0 Profile component for FinVerse application
 * Displays Auth0 user info and integrates with existing profile functionality
 */

import { useAuth0 } from '@auth0/auth0-react';
import { Container, Paper, Text, Button, Stack, Group, Card, Title, Loader, Alert } from '@mantine/core';
import { IconAlertCircle, IconUser } from '@tabler/icons-react';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import Profile from '../components/Profile';

const AuthProfile = () => {
    const { isAuthenticated, isLoading, error, user } = useAuth0();

    if (isLoading) {
        return (
            <Container size="sm" py="xl">
                <Paper p="xl" shadow="md" radius="md" style={{ textAlign: 'center' }}>
                    <Loader size="lg" mb="md" />
                    <Text size="lg">Loading your profile...</Text>
                </Paper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container size="sm" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Authentication Error"
                    color="red"
                    radius="md"
                >
                    <Text mb="md">{error.message}</Text>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!isAuthenticated) {
        return (
            <Container size="sm" py="xl">
                <Paper p="xl" shadow="md" radius="md" style={{ textAlign: 'center' }}>
                    <IconUser size={64} style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
                    <Title order={2} mb="md">Welcome to FinVerse</Title>
                    <Text size="lg" c="dimmed" mb="xl">
                        Sign in to access your financial profile and personalized recommendations
                    </Text>
                    <LoginButton />
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                {/* Auth0 User Info Header */}
                <Card p="xl" shadow="md" radius="md">
                    <Group justify="space-between" align="flex-start" mb="lg">
                        <div>
                            <Title order={2} mb="xs">Authentication Status</Title>
                            <Text c="dimmed">Connected via Auth0</Text>
                        </div>
                        <LogoutButton />
                    </Group>

                    <Profile />

                    {user && (
                        <Paper p="md" bg="gray.0" radius="md" mt="lg">
                            <Text size="sm" fw={500} mb="xs">Auth0 User Details:</Text>
                            <Stack gap="xs">
                                <Group gap="xs">
                                    <Text size="sm" fw={500}>User ID:</Text>
                                    <Text size="sm" c="dimmed" style={{ fontFamily: 'monospace' }}>
                                        {user.sub}
                                    </Text>
                                </Group>
                                {user.email_verified && (
                                    <Group gap="xs">
                                        <Text size="sm" fw={500}>Email Verified:</Text>
                                        <Text size="sm" c="green">✓ Verified</Text>
                                    </Group>
                                )}
                                {user.updated_at && (
                                    <Group gap="xs">
                                        <Text size="sm" fw={500}>Last Updated:</Text>
                                        <Text size="sm" c="dimmed">
                                            {new Date(user.updated_at).toLocaleDateString()}
                                        </Text>
                                    </Group>
                                )}
                            </Stack>
                        </Paper>
                    )}
                </Card>

                {/* Integration Notice */}
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="FinVerse Profile Integration"
                    color="blue"
                    variant="light"
                >
                    <Text size="sm">
                        Your Auth0 authentication is now integrated with FinVerse!
                        To access the full FinVerse profile features (financial preferences, saved products, etc.),
                        you can extend this component to include your existing profile functionality from pages/Profile.tsx.
                    </Text>
                </Alert>
            </Stack>
        </Container>
    );
};

export default AuthProfile;
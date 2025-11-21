import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Text, Group, Stack, Paper, Loader } from '@mantine/core';

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <Loader size="md" />;
    }

    return (
        isAuthenticated && user ? (
            <Paper shadow="md" p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Stack align="center" gap="md">
                    <Avatar
                        src={user.picture}
                        alt={user.name || 'User'}
                        size={120}
                        radius="xl"
                    />
                    <Group align="center" gap="xs">
                        <Stack align="center" gap={4}>
                            <Text size="xl" fw={600}>
                                {user.name}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {user.email}
                            </Text>
                        </Stack>
                    </Group>
                </Stack>
            </Paper>
        ) : null
    );
};

export default Profile;
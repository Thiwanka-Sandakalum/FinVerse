/**
 * User Profile Page for Members
 * Allows members to view their basic profile information (read-only)
 */

import { useState, useEffect } from 'react'
import {
    Stack,
    Title,
    Card,
    Grid,
    TextInput,
    Button,
    Group,
    Text,
    Badge,
    Avatar,
    Divider,
    Alert,
    ThemeIcon
} from '@mantine/core'
import {
    IconUser,
    IconMail,
    IconPhone,
    IconBuilding,
    IconInfoCircle,
    IconSettings,
    IconShield
} from '@tabler/icons-react'
import { useAuth } from '../../hooks/useAuth'
import { useDummyData } from '../../context/DummyDataContext'
import type { User } from '../../types'

const UserProfile = () => {
    const { user: authUser } = useAuth()
    const { users } = useDummyData()
    const [user, setUser] = useState<User | null>(null)

    // In a real app, this would come from the authenticated user's data
    useEffect(() => {
        if (authUser?.email) {
            // Find the user in our dummy data by email or use the auth user data
            const foundUser = users.find(u => u.email === authUser.email)
            if (foundUser) {
                setUser(foundUser)
            } else {
                // Create a user object from auth data if not found in dummy data
                const userFromAuth: User = {
                    id: authUser.sub || 'demo-user',
                    firstName: authUser.given_name || authUser.name?.split(' ')[0] || 'Demo',
                    lastName: authUser.family_name || authUser.name?.split(' ').slice(1).join(' ') || 'User',
                    email: authUser.email,
                    role: 'User',
                    status: 'Active',
                    createdAt: new Date().toISOString(),
                    permissions: [],
                    phone: authUser.phone_number || '',
                    organizationId: 'org-1',
                    organizationName: 'Demo Organization'
                }
                setUser(userFromAuth)
            }
        }
    }, [authUser, users])

    if (!user) {
        return (
            <Stack gap="lg">
                <Alert icon={<IconInfoCircle size="1rem" />} title="Profile Loading" color="blue">
                    Loading your profile information...
                </Alert>
            </Stack>
        )
    }

    const getStatusColor = (status: User['status']) => {
        switch (status) {
            case 'Active': return 'green'
            case 'Inactive': return 'red'
            case 'Pending': return 'yellow'
            default: return 'gray'
        }
    }

    const getRoleColor = (role: User['role']) => {
        switch (role) {
            case 'Admin': return 'red'
            case 'Manager': return 'blue'
            case 'User': return 'green'
            case 'Viewer': return 'gray'
            default: return 'gray'
        }
    }

    return (
        <Stack gap="lg">
            {/* Header */}
            <Group justify="space-between">
                <Group>
                    <Avatar size="lg" radius="md" color="blue">
                        {user.avatar ? (
                            <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        ) : (
                            <IconUser size="1.5rem" />
                        )}
                    </Avatar>
                    <div>
                        <Title order={2}>{user.firstName} {user.lastName}</Title>
                        <Text c="dimmed">Member Profile</Text>
                    </div>
                </Group>
                <Group>
                    <Badge color={getStatusColor(user.status)} size="lg">
                        {user.status}
                    </Badge>
                    <Badge color={getRoleColor(user.role)} size="lg" variant="light">
                        {user.role}
                    </Badge>
                </Group>
            </Group>

            {/* Info Alert for Members */}
            <Alert
                icon={<IconInfoCircle size="1rem" />}
                title="Profile Information"
                color="blue"
                variant="light"
            >
                Your profile information is managed by your organization administrator.
                If you need to update any details, please contact your administrator.
            </Alert>

            <Grid>
                {/* User Details */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Title order={3}>Personal Information</Title>
                            <Divider />

                            <Grid>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="First Name"
                                        value={user.firstName}
                                        disabled
                                        leftSection={<IconUser size="1rem" />}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Last Name"
                                        value={user.lastName}
                                        disabled
                                        leftSection={<IconUser size="1rem" />}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Email"
                                        value={user.email}
                                        disabled
                                        leftSection={<IconMail size="1rem" />}
                                        type="email"
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Phone"
                                        value={user.phone || 'Not provided'}
                                        disabled
                                        leftSection={<IconPhone size="1rem" />}
                                    />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <TextInput
                                        label="Organization"
                                        value={user.organizationName || 'Not assigned'}
                                        disabled
                                        leftSection={<IconBuilding size="1rem" />}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Divider />
                            <Title order={4}>Account Information</Title>

                            <Grid>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="User Role"
                                        value={user.role}
                                        disabled
                                        leftSection={<IconShield size="1rem" />}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Account Status"
                                        value={user.status}
                                        disabled
                                        leftSection={<IconSettings size="1rem" />}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* User Stats & Actions */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Stack gap="md">
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4} mb="md">Account Details</Title>
                            <Stack gap="sm">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Account Created</Text>
                                    <Text size="sm" fw={500}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Text>
                                </Group>
                                {user.lastLogin && (
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Last Login</Text>
                                        <Text size="sm" fw={500}>
                                            {new Date(user.lastLogin).toLocaleDateString()}
                                        </Text>
                                    </Group>
                                )}
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">User ID</Text>
                                    <Text size="sm" fw={500} style={{ fontFamily: 'monospace' }}>
                                        {user.id.length > 8 ? `${user.id.substring(0, 8)}...` : user.id}
                                    </Text>
                                </Group>
                            </Stack>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4} mb="md">Permissions</Title>
                            <Stack gap="xs">
                                {user.permissions.length > 0 ? (
                                    user.permissions.slice(0, 5).map((permission, index) => (
                                        <Group key={index} gap="xs">
                                            <ThemeIcon size="sm" color="blue" variant="light">
                                                <IconShield size="0.8rem" />
                                            </ThemeIcon>
                                            <Text size="sm">{permission}</Text>
                                        </Group>
                                    ))
                                ) : (
                                    <Text size="sm" c="dimmed">Standard user permissions</Text>
                                )}
                                {user.permissions.length > 5 && (
                                    <Text size="xs" c="dimmed">
                                        ... and {user.permissions.length - 5} more
                                    </Text>
                                )}
                            </Stack>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4} mb="md">Quick Actions</Title>
                            <Stack gap="sm">
                                <Button variant="light" size="sm" fullWidth>
                                    View My Applications
                                </Button>
                                <Button variant="light" size="sm" fullWidth>
                                    Browse Products
                                </Button>
                                <Button variant="light" size="sm" fullWidth>
                                    Contact Support
                                </Button>
                            </Stack>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4} mb="md">Need Changes?</Title>
                            <Stack gap="sm">
                                <Text size="sm" c="dimmed">
                                    To update your profile information, contact your organization administrator
                                    or submit a support request.
                                </Text>
                                <Button variant="outline" size="sm" fullWidth>
                                    Request Profile Update
                                </Button>
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Stack>
    )
}

export default UserProfile
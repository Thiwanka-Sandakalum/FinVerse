import {
    Group,
    Text,
    TextInput,
    ActionIcon,
    Menu,
    Avatar,
    UnstyledButton,
    useMantineColorScheme
} from '@mantine/core'
import {
    IconSearch,
    IconBell,
    IconMenu2,
    IconSun,
    IconMoon,
    IconSettings,
    IconLogout,
    IconUser
} from '@tabler/icons-react'
import { useUI } from '../context/UIContext'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../types/auth.types'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
    const { toggleSidebar, searchQuery, setSearchQuery } = useUI()
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const { logout, user, getAccessTokenSilently, getIdTokenClaims } = useAuth0();
    const { role } = useAuth()
    const navigate = useNavigate()
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const accessToken = await getIdTokenClaims();
                console.log(accessToken);
                // setToken(accessToken);
            } catch (error) {
                console.error('Failed to get access token:', error);
                setToken(null);
            }
        };

        if (user) {
            fetchToken();
        }
    }, [getAccessTokenSilently, user]);

    // Function to navigate to appropriate profile page based on user role
    const handleProfileClick = () => {
        if (role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN) {
            // For super_admin and org_admin, default to organization profile
            navigate('/profile/organization')
        } else {
            // For members and others, go to user profile
            navigate('/profile/user')
        }
    }

    console.log(token);
    return (
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <ActionIcon
                    variant="subtle"
                    onClick={toggleSidebar}
                    size="lg"
                >
                    <IconMenu2 size={20} />
                </ActionIcon>

                <Text size="xl" fw={700} c="primary">
                    FinVerse Admin
                </Text>
            </Group>

            <Group gap="md">
                <TextInput
                    placeholder="Search organizations, users, products..."
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    w={300}
                    styles={{
                        input: {
                            '&:focus': {
                                borderColor: 'var(--mantine-color-primary-6)'
                            }
                        }
                    }}
                />

                <ActionIcon
                    variant="subtle"
                    onClick={toggleColorScheme}
                    size="lg"
                >
                    {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
                </ActionIcon>

                <ActionIcon variant="subtle" size="lg">
                    <IconBell size={20} />
                </ActionIcon>

                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <UnstyledButton>
                            <Group gap="sm">
                                <Avatar
                                    src={user?.picture || "https://via.placeholder.com/40x40?text=AD"}
                                    alt={user?.name || "Admin"}
                                    radius="xl"
                                    size="sm"
                                />
                                <div style={{ flex: 1 }}>
                                    <Text size="sm" fw={500}>
                                        {user?.name || "Admin User"}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {user?.email || "admin@finverse.com"}
                                    </Text>
                                </div>
                            </Group>
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Account</Menu.Label>
                        <Menu.Item leftSection={<IconUser size={14} />} onClick={handleProfileClick}>
                            Profile
                        </Menu.Item>
                        <Menu.Item leftSection={<IconSettings size={14} />}>
                            Settings
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Item
                            leftSection={<IconLogout size={14} />}
                            color="red"
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </Group>
    )
}

export default Navbar

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Group,
    Text,
    Menu,
    UnstyledButton,
    Button,
    Avatar,
    rem,
    Box,
} from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import {
    IconChevronDown,
    IconCreditCard,
    IconPigMoney,
    IconHome,
    IconShield,
    IconTrendingUp,
    IconCalculator,
    IconUser,
} from '@tabler/icons-react';

import SearchBar from './SearchBar';

const categories = [
    { label: 'Credit Cards', value: 'credit-cards', icon: IconCreditCard },
    { label: 'Loans', value: 'loans', icon: IconPigMoney },
    { label: 'Mortgages', value: 'mortgages', icon: IconHome },
    { label: 'Insurance', value: 'insurance', icon: IconShield },
    { label: 'Investments', value: 'investments', icon: IconTrendingUp },
    { label: 'Savings', value: 'savings', icon: IconCalculator },
];

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { width } = useViewportSize();
    const isMobile = width < 768;

    // Auth0 hooks
    const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();

    const handleCategoryClick = (categoryValue: string) => {
        navigate(`/products?category=${categoryValue}`);
    };

    const handleLogin = () => {
        loginWithRedirect();
    };

    const handleLogout = () => {
        // Clear only comparison data (saved product logic removed)
        localStorage.removeItem('finverse-comparison');
        // Then logout from Auth0
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <Group gap={isMobile ? "sm" : "xl"} style={{ flex: 1, width: '100%' }} align="center" justify="space-between">
            {/* Left section: Logo and Categories */}
            <Group gap={isMobile ? "xs" : "xl"} align="center">
                {/* Logo */}
                <UnstyledButton component={Link} to="/">
                    <Group gap="sm" align="center">
                        <div
                            style={{
                                width: rem(32),
                                height: rem(32),
                                background: 'linear-gradient(135deg, #0B74FF 0%, #20C997 100%)',
                                borderRadius: rem(8),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: rem(16),
                                fontWeight: 'bold',
                            }}
                        >
                            F
                        </div>
                        {!isMobile && (
                            <Text size="xl" fw={700} className="gradient-text">
                                FinVerse
                            </Text>
                        )}
                    </Group>
                </UnstyledButton>

                {/* Categories Menu - Hide on very small screens */}
                {!isMobile && (
                    <Menu shadow="md" width={200} position="bottom-start">
                        <Menu.Target>
                            <UnstyledButton>
                                <Group gap={rem(4)} align="center">
                                    <Text size="sm" fw={500}>
                                        Categories
                                    </Text>
                                    <IconChevronDown size={16} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Product Categories</Menu.Label>
                            {categories.map((category) => (
                                <Menu.Item
                                    key={category.value}
                                    leftSection={<category.icon size={16} />}
                                    onClick={() => handleCategoryClick(category.value)}
                                >
                                    {category.label}
                                </Menu.Item>
                            ))}
                        </Menu.Dropdown>
                    </Menu>
                )}
            </Group>

            {/* Center section: Search Bar */}
            <Box style={{ flex: 1, maxWidth: isMobile ? rem(200) : rem(400), minWidth: rem(150) }}>
                <SearchBar />
            </Box>

            {/* Right section: User Actions */}
            <Group gap={isMobile ? "xs" : "sm"} align="center">
                {isAuthenticated && user ? (
                    <Menu shadow="md" width={250} position="bottom-end">
                        <Menu.Target>
                            <UnstyledButton>
                                <Group gap="sm" align="center">
                                    <Avatar
                                        src={user.picture}
                                        alt={user.name}
                                        size="sm"
                                        radius="xl"
                                    />
                                    {!isMobile && (
                                        <Group gap="xs" align="center">
                                            <Text size="sm" fw={500}>
                                                {user.name || user.email}
                                            </Text>
                                        </Group>
                                    )}
                                    <IconChevronDown size={16} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>FinVerse Profile</Menu.Label>
                            <Menu.Item component={Link} to="/profile" leftSection={<IconUser size={16} />}>
                                Profile
                            </Menu.Item>
                            <Menu.Divider />
                            {/* <Menu.Item>Saved Products</Menu.Item> */}
                            <Menu.Item>Applications</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item onClick={handleLogout} color="red">
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                ) : (
                    <>
                        {!isMobile ? (
                            <>
                                <Button variant="subtle" onClick={handleLogin} loading={isLoading}>
                                    Login
                                </Button>
                                <Button
                                    variant="gradient"
                                    gradient={{ from: 'finBlue.6', to: 'finGreen.6', deg: 135 }}
                                    onClick={handleLogin}
                                    loading={isLoading}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="gradient"
                                gradient={{ from: 'finBlue.6', to: 'finGreen.6', deg: 135 }}
                                onClick={handleLogin}
                                size="xs"
                                loading={isLoading}
                            >
                                Login
                            </Button>
                        )}
                    </>
                )}
            </Group>
        </Group>
    );
};

export default Navbar;
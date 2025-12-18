import { MultiSelect, Select } from '@mantine/core';
import type { UserProfileResponse } from '../types/UserProfileResponse';
// Options for the new profile form
const employmentOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'student', label: 'Student' },
    { value: 'self-employed', label: 'Self-employed' },
    { value: 'unemployed', label: 'Unemployed' },
];

const incomeOptions = [
    { value: '<50k', label: 'LKR <50k' },
    { value: '50k-100k', label: 'LKR 50k–100k' },
    { value: '100k-200k', label: 'LKR 100k–200k' },
    { value: '200k-500k', label: 'LKR 200k–500k' },
    { value: '>500k', label: 'LKR >500k' },
];

const goalOptions = [
    { value: 'saving', label: 'Saving' },
    { value: 'investment', label: 'Investment' },
    { value: 'loan-management', label: 'Loan Management' },
    { value: 'credit-building', label: 'Credit Building' },
    { value: 'budgeting', label: 'Budgeting' },
];

const productOptions = [
    { value: 'loans', label: 'Loans' },
    { value: 'credit-cards', label: 'Credit Cards' },
    { value: 'savings-accounts', label: 'Savings Accounts' },
    { value: 'investments', label: 'Investments' },
];

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'si', label: 'Sinhala' },
    { value: 'ta', label: 'Tamil' },
];

const countryOptions = [
    { value: 'LK', label: 'Sri Lanka' },
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
];
// Helper function to map Auth0 user to UserProfileResponse
const mapUserToProfile = (user: any): UserProfileResponse => {
    const meta = user.user_metadata || {};
    return {
        id: user.id || user.user_id,
        fullName: user.name || '',
        email: user.email || '',
        picture: user.picture || '',
        phone: meta.phone || '',
        country: meta.country || '',
        city: meta.city || '',
        employmentStatus: meta.employmentStatus || '',
        incomeRange: meta.incomeRange || '',
        financialGoal: Array.isArray(meta.financialGoal)
            ? meta.financialGoal
            : meta.financialGoal
                ? [meta.financialGoal]
                : [],
        interestedProduct: meta.interestedProduct || [],
        preferredLanguage: meta.preferredLanguage || '',
        createdAt: user.created_at || new Date().toISOString(),
        updatedAt: user.updated_at || new Date().toISOString(),
    };
};

/**
 * Profile page component for FinVerse application
 * User dashboard with account settings, saved products, and application history
 */

import React, { useState, useEffect } from 'react';
import { UsersService } from '../types/user/services/UsersService';
import { ProductsService } from '../types/products/services/ProductsService';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Card,
    Badge,
    SimpleGrid,
    Avatar,
    TextInput,
    Paper,
    Loader,
    Alert,
    ActionIcon,
    Tooltip,
    Stack,
    Grid,
    Image,
    Divider,
} from '@mantine/core';
import {
    IconUser,
    IconEdit,
    IconHeart,
    IconTrash,
    IconHeartFilled,
    IconExternalLink,
    IconTrendingUp,
    IconShieldCheck,
    IconCreditCard,
    IconPigMoney,
    IconChartLine,
    IconStar,
    IconClock,
    IconBell,
    IconGift,
    IconTarget,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';


import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    // Removed unused activeTab
    const [editMode, setEditMode] = useState(false);
    const [userDetails, setUserDetails] = useState<UserProfileResponse | null>(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);
    const [editFields, setEditFields] = useState({
        name: '',
        picture: '',
        phone: '',
        country: '',
        city: '',
        employmentStatus: '',
        incomeRange: '',
        financialGoal: [] as string[],
        interestedProduct: [] as string[],
        preferredLanguage: '',
    });
    const [saving, setSaving] = useState(false);

    // Saved products state
    const [savedProducts, setSavedProducts] = useState<any[]>([]);
    const [savedProductsLoading, setSavedProductsLoading] = useState(false);
    const [savedProductsError, setSavedProductsError] = useState<string | null>(null);
    const [removingProducts, setRemovingProducts] = useState<Set<string>>(new Set());

    // Auth0 hooks
    const { isAuthenticated, user: auth0User } = useAuth0();


    // Fetch user details from API and sync with app state
    useEffect(() => {
        if (auth0User?.sub) {
            setUserLoading(true);
            UsersService.getUsers1(auth0User.sub)
                .then((data) => {
                    const mappedUser = mapUserToProfile(data);
                    setUserDetails(mappedUser);
                    setEditFields({
                        name: mappedUser.fullName || '',
                        picture: mappedUser.picture || '',
                        phone: mappedUser.phone || '',
                        country: mappedUser.country || '',
                        city: mappedUser.city || '',
                        employmentStatus: mappedUser.employmentStatus || '',
                        incomeRange: mappedUser.incomeRange || '',
                        financialGoal: Array.isArray(mappedUser.financialGoal)
                            ? mappedUser.financialGoal
                            : mappedUser.financialGoal
                                ? [mappedUser.financialGoal]
                                : [],
                        interestedProduct: mappedUser.interestedProduct || [],
                        preferredLanguage: mappedUser.preferredLanguage || '',
                    });
                    setUserError(null);
                })
                .catch(() => {
                    setUserError('Failed to load user details');
                })
                .finally(() => setUserLoading(false));
        }
    }, [auth0User?.sub]);

    // Fetch saved products
    useEffect(() => {
        if (isAuthenticated) {
            fetchSavedProducts();
        }
    }, [isAuthenticated]);

    const fetchSavedProducts = async () => {
        setSavedProductsLoading(true);
        try {
            const response = await ProductsService.getProductsSaved(1, 50); // Get first 50 saved products
            setSavedProducts(response.data || []);
            setSavedProductsError(null);
        } catch (error) {
            console.error('Error fetching saved products:', error);
            setSavedProductsError('Failed to load saved products');
            setSavedProducts([]);
        } finally {
            setSavedProductsLoading(false);
        }
    };

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <Container size="xl">
                <Paper p="xl" ta="center">
                    <IconUser size={64} style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
                    <Title order={2} mb="md">Welcome to FinVerse</Title>
                    <Text size="lg" c="dimmed" mb="xl">
                        Sign in with Auth0 to access your financial profile and personalized recommendations
                    </Text>
                    <LoginButton />
                    <Button variant="subtle" mt="md" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </Paper>
            </Container>
        );
    }


    // Edit field handler
    const handleEditFieldChange = (field: string, value: any) => {
        setEditFields((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveUser = async () => {
        if (!auth0User?.sub) return;
        setSaving(true);
        try {
            const updated = await UsersService.putUsers(auth0User.sub, {
                metadata: {
                    phone: editFields.phone,
                    country: editFields.country,
                    city: editFields.city,
                    employmentStatus: editFields.employmentStatus,
                    incomeRange: editFields.incomeRange,
                    financialGoal: editFields.financialGoal,
                    interestedProduct: editFields.interestedProduct,
                    preferredLanguage: editFields.preferredLanguage,
                },
            });
            const mappedUser = mapUserToProfile(updated);
            setUserDetails(mappedUser);
            setEditMode(false);
        } catch (e) {
            setUserError('Failed to update user details');
        } finally {
            setSaving(false);
        }
    };

    // Handle removing saved product
    const handleRemoveSavedProduct = async (productId: string) => {
        setRemovingProducts(prev => new Set(prev).add(productId));
        try {
            await ProductsService.deleteProductsSave(productId);
            setSavedProducts(prev => prev.filter(product => product.id !== productId));
            notifications.show({
                title: 'Product Removed',
                message: 'Product has been removed from your saved list.',
                color: 'green',
            });
        } catch (error) {
            console.error('Error removing saved product:', error);
            notifications.show({
                title: 'Error',
                message: 'Failed to remove product from saved list.',
                color: 'red',
            });
        } finally {
            setRemovingProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    // Navigate to product details
    const handleViewProduct = (productId: string) => {
        navigate(`/products/${productId}`);
    };

    // Mock data for dashboard stats (in real app, these would come from API)
    const dashboardStats = [
        {
            title: 'Products Saved',
            value: savedProducts.length.toString(),
            icon: IconHeart,
            color: 'red',
            description: 'Your favorite products'
        },
        {
            title: 'Profile Complete',
            value: `${Math.round(((userDetails?.phone ? 1 : 0) +
                (userDetails?.country ? 1 : 0) +
                (userDetails?.employmentStatus ? 1 : 0) +
                (userDetails?.incomeRange ? 1 : 0) +
                (userDetails?.financialGoal?.length ? 1 : 0)) / 5 * 100)}%`,
            icon: IconShieldCheck,
            color: 'green',
            description: 'Complete your profile for better recommendations'
        },
        {
            title: 'Applications',
            value: '0',
            icon: IconCreditCard,
            color: 'blue',
            description: 'Active applications'
        },
        {
            title: 'Recommendations',
            value: '12',
            icon: IconTrendingUp,
            color: 'orange',
            description: 'Personalized for you'
        }
    ];

    // Mock recent activities
    const recentActivities = [
        {
            id: '1',
            type: 'saved',
            title: 'Saved Commercial Bank Credit Card',
            time: '2 hours ago',
            icon: IconHeart,
            color: 'red'
        },
        {
            id: '2',
            type: 'viewed',
            title: 'Viewed Sampath Bank Personal Loan',
            time: '1 day ago',
            icon: IconExternalLink,
            color: 'blue'
        },
        {
            id: '3',
            type: 'compared',
            title: 'Compared 3 Savings Accounts',
            time: '2 days ago',
            icon: IconChartLine,
            color: 'green'
        },
        {
            id: '4',
            type: 'profile',
            title: 'Updated profile information',
            time: '1 week ago',
            icon: IconEdit,
            color: 'orange'
        }
    ];

    // Mock personalized recommendations
    const recommendations = [
        {
            id: '1',
            title: 'High Yield Savings Account',
            provider: 'Bank of Ceylon',
            reason: 'Based on your savings goal',
            interestRate: '8.5%',
            color: 'green',
            icon: IconPigMoney
        },
        {
            id: '2',
            title: 'Student Credit Card',
            provider: 'Commercial Bank',
            reason: 'Matches your employment status',
            annualFee: 'LKR 0',
            color: 'blue',
            icon: IconCreditCard
        },
        {
            id: '3',
            title: 'Investment Portfolio',
            provider: 'CSE Investments',
            reason: 'Perfect for your investment goals',
            returns: '12% p.a.',
            color: 'orange',
            icon: IconTrendingUp
        }
    ];

    return (
        <Container size="xl">
            {/* Auth0 User Header */}
            <Card p="xl" withBorder mb="xl" className="animate-fadeInUp">
                <Group gap="xl" align="flex-start">
                    <Avatar
                        src={auth0User?.picture}
                        size={100}
                        radius="md"
                        alt={auth0User?.name}
                    />
                    <div style={{ flex: 1 }}>
                        <Group justify="space-between" mb="md">
                            <div>
                                <Group gap="sm" align="center" mb="xs">
                                    <Title order={2} fw={700}>
                                        Welcome back, {auth0User?.name}
                                    </Title>
                                    <Badge size="sm" variant="light" color="green">
                                        Auth0
                                    </Badge>
                                </Group>
                                <Text c="dimmed" size="lg" mb="xs">
                                    {auth0User?.email}
                                </Text>
                                {auth0User?.email_verified && (
                                    <Badge size="xs" variant="light" color="green">
                                        ✓ Email Verified
                                    </Badge>
                                )}
                            </div>
                            <Group gap="sm">
                                <LogoutButton />
                                {!editMode && (
                                    <Button
                                        variant="outline"
                                        leftSection={<IconEdit size={16} />}
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Group>
                        </Group>
                    </div>
                </Group>
            </Card>

            {/* Dashboard Stats */}
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mb="xl">
                {dashboardStats.map((stat, index) => (
                    <Card key={index} p="lg" withBorder className="hover-card">
                        <Group gap="sm" align="flex-start">
                            <div style={{
                                padding: '8px',
                                borderRadius: '8px',
                                backgroundColor: `var(--mantine-color-${stat.color}-1)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <stat.icon size={20} color={`var(--mantine-color-${stat.color}-6)`} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Text size="xs" c="dimmed" mb={2}>
                                    {stat.title}
                                </Text>
                                <Text size="xl" fw={700} mb={2}>
                                    {stat.value}
                                </Text>
                                <Text size="xs" c="dimmed" lineClamp={2}>
                                    {stat.description}
                                </Text>
                            </div>
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Quick Actions & Recent Activity */}
            <Grid mb="xl">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    {/* Recent Activity */}
                    <Card p="lg" withBorder h="100%">
                        <Group justify="space-between" mb="md">
                            <Group gap="sm">
                                <IconClock size={20} />
                                <Title order={4}>Recent Activity</Title>
                            </Group>
                            <Button variant="subtle" size="xs">View All</Button>
                        </Group>
                        <Stack gap="md">
                            {recentActivities.map((activity) => (
                                <Group key={activity.id} gap="md" p="sm" style={{
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--mantine-color-gray-0)',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <div style={{
                                        padding: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: `var(--mantine-color-${activity.color}-1)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <activity.icon size={16} color={`var(--mantine-color-${activity.color}-6)`} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Text size="sm" fw={500}>
                                            {activity.title}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {activity.time}
                                        </Text>
                                    </div>
                                </Group>
                            ))}
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    {/* Quick Actions */}
                    <Card p="lg" withBorder mb="md">
                        <Group gap="sm" mb="md">
                            <IconTarget size={20} />
                            <Title order={4}>Quick Actions</Title>
                        </Group>
                        <Stack gap="sm">
                            <Button
                                variant="light"
                                leftSection={<IconCreditCard size={16} />}
                                onClick={() => navigate('/products?category=credit-cards')}
                                fullWidth
                            >
                                Browse Credit Cards
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconPigMoney size={16} />}
                                onClick={() => navigate('/products?category=savings')}
                                fullWidth
                            >
                                Find Savings Account
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconChartLine size={16} />}
                                onClick={() => navigate('/compare')}
                                fullWidth
                            >
                                Compare Products
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconBell size={16} />}
                                onClick={() => navigate('/notifications')}
                                fullWidth
                            >
                                Notifications
                            </Button>
                        </Stack>
                    </Card>

                    {/* Profile Completion */}
                    <Card p="lg" withBorder>
                        <Group gap="sm" mb="md">
                            <IconShieldCheck size={20} />
                            <Title order={4}>Profile Status</Title>
                        </Group>
                        <Stack gap="sm">
                            <div>
                                <Group justify="space-between" mb="xs">
                                    <Text size="sm">Completion</Text>
                                    <Text size="sm" fw={600}>
                                        {Math.round(((userDetails?.phone ? 1 : 0) +
                                            (userDetails?.country ? 1 : 0) +
                                            (userDetails?.employmentStatus ? 1 : 0) +
                                            (userDetails?.incomeRange ? 1 : 0) +
                                            (userDetails?.financialGoal?.length ? 1 : 0)) / 5 * 100)}%
                                    </Text>
                                </Group>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: 'var(--mantine-color-gray-2)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${Math.round(((userDetails?.phone ? 1 : 0) +
                                            (userDetails?.country ? 1 : 0) +
                                            (userDetails?.employmentStatus ? 1 : 0) +
                                            (userDetails?.incomeRange ? 1 : 0) +
                                            (userDetails?.financialGoal?.length ? 1 : 0)) / 5 * 100)}%`,
                                        height: '100%',
                                        backgroundColor: 'var(--mantine-color-green-6)',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                            {!editMode && (
                                <Button
                                    size="xs"
                                    variant="light"
                                    onClick={() => setEditMode(true)}
                                    fullWidth
                                >
                                    Complete Profile
                                </Button>
                            )}
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Personalized Recommendations */}
            <Card p="lg" withBorder mb="xl">
                <Group justify="space-between" mb="lg">
                    <Group gap="sm">
                        <IconGift size={24} color="var(--mantine-color-orange-6)" />
                        <Title order={3}>Recommended For You</Title>
                        <Badge variant="light" color="orange">
                            New
                        </Badge>
                    </Group>
                    <Button variant="light" size="sm" onClick={() => navigate('/products')}>
                        View All Products
                    </Button>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                    {recommendations.map((rec) => (
                        <Card key={rec.id} p="md" withBorder className="hover-card" style={{ cursor: 'pointer' }}>
                            <Stack gap="sm">
                                <Group gap="sm">
                                    <div style={{
                                        padding: '8px',
                                        borderRadius: '8px',
                                        backgroundColor: `var(--mantine-color-${rec.color}-1)`
                                    }}>
                                        <rec.icon size={20} color={`var(--mantine-color-${rec.color}-6)`} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Text fw={600} size="sm" lineClamp={1}>
                                            {rec.title}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {rec.provider}
                                        </Text>
                                    </div>
                                </Group>

                                <Badge size="xs" variant="light" color={rec.color}>
                                    {rec.reason}
                                </Badge>

                                <Group justify="space-between" align="center">
                                    <Group gap="xs">
                                        <IconStar size={12} color="var(--mantine-color-yellow-6)" />
                                        <Text size="xs" c="dimmed">
                                            {rec.interestRate || rec.annualFee || rec.returns}
                                        </Text>
                                    </Group>
                                    <Button size="xs" variant="light">
                                        Learn More
                                    </Button>
                                </Group>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            </Card>

            {/* Profile Panel */}
            <Card p="xl" withBorder>
                <Group justify="space-between" mb="lg">
                    <Title order={3}>Personal Information</Title>
                    {userDetails && (
                        <Button
                            variant="outline"
                            leftSection={<IconEdit size={16} />}
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? 'Cancel' : 'Edit'}
                        </Button>
                    )}
                </Group>
                {userLoading ? (
                    <Loader />
                ) : userError ? (
                    <Alert color="red">{userError}</Alert>
                ) : userDetails ? (
                    editMode ? (
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                            <TextInput
                                label="Full Name"
                                value={editFields.name}
                                onChange={(e) => handleEditFieldChange('name', e.target.value)}
                            />
                            <TextInput
                                label="Email"
                                value={userDetails.email}
                                disabled
                                description="Email cannot be changed"
                            />
                            <TextInput
                                label="Phone"
                                value={editFields.phone}
                                onChange={(e) => handleEditFieldChange('phone', e.target.value)}
                            />
                            <Select
                                label="Country"
                                value={editFields.country}
                                onChange={(val) => handleEditFieldChange('country', val)}
                                data={countryOptions}
                                searchable
                                clearable
                            />
                            <TextInput
                                label="City"
                                value={editFields.city}
                                onChange={(e) => handleEditFieldChange('city', e.target.value)}
                            />
                            <Select
                                label="Employment Status"
                                value={editFields.employmentStatus}
                                onChange={(val) => handleEditFieldChange('employmentStatus', val)}
                                data={employmentOptions}
                                clearable
                            />
                            <Select
                                label="Income Range"
                                value={editFields.incomeRange}
                                onChange={(val) => handleEditFieldChange('incomeRange', val)}
                                data={incomeOptions}
                                clearable
                            />
                            <MultiSelect
                                label="Financial Goals"
                                value={editFields.financialGoal}
                                onChange={(val) => handleEditFieldChange('financialGoal', val)}
                                data={goalOptions}
                                clearable
                            />
                            <MultiSelect
                                label="Interested Products"
                                value={editFields.interestedProduct}
                                onChange={(val) => handleEditFieldChange('interestedProduct', val)}
                                data={productOptions}
                                clearable
                            />
                            <Select
                                label="Preferred Language"
                                value={editFields.preferredLanguage}
                                onChange={(val) => handleEditFieldChange('preferredLanguage', val)}
                                data={languageOptions}
                                clearable
                            />
                            <Group justify="flex-end" mt="lg" style={{ gridColumn: '1 / -1' }}>
                                <Button variant="outline" onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                                <Button loading={saving} onClick={handleSaveUser}>
                                    Save Changes
                                </Button>
                            </Group>
                        </SimpleGrid>
                    ) : (
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                            <TextInput
                                label="Full Name"
                                value={userDetails.fullName}
                                disabled
                            />
                            <TextInput
                                label="Email"
                                value={userDetails.email}
                                disabled
                            />
                            <TextInput
                                label="Phone"
                                value={userDetails.phone}
                                disabled
                            />
                            <TextInput
                                label="Country"
                                value={userDetails.country}
                                disabled
                            />
                            <TextInput
                                label="City"
                                value={userDetails.city}
                                disabled
                            />
                            <TextInput
                                label="Employment Status"
                                value={userDetails.employmentStatus}
                                disabled
                            />
                            <TextInput
                                label="Income Range"
                                value={userDetails.incomeRange}
                                disabled
                            />
                            <TextInput
                                label="Financial Goals"
                                value={Array.isArray(userDetails.financialGoal) ? userDetails.financialGoal.join(', ') : userDetails.financialGoal || ''}
                                disabled
                            />
                            <TextInput
                                label="Interested Products"
                                value={Array.isArray(userDetails.interestedProduct) ? userDetails.interestedProduct.join(', ') : userDetails.interestedProduct || ''}
                                disabled
                            />
                            <TextInput
                                label="Preferred Language"
                                value={userDetails.preferredLanguage}
                                disabled
                            />
                        </SimpleGrid>
                    )
                ) : null}
            </Card>

            {/* Saved Products Section */}
            <Card p="xl" withBorder mt="xl">
                <Group justify="space-between" mb="lg">
                    <Group gap="sm" align="center">
                        <IconHeartFilled size={24} color="var(--mantine-color-red-6)" />
                        <Title order={3}>Saved Products</Title>
                        <Badge variant="light" color="red">
                            {savedProducts.length}
                        </Badge>
                    </Group>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={fetchSavedProducts}
                        loading={savedProductsLoading}
                    >
                        Refresh
                    </Button>
                </Group>

                {savedProductsLoading ? (
                    <Group justify="center" py="xl">
                        <Loader />
                        <Text c="dimmed">Loading saved products...</Text>
                    </Group>
                ) : savedProductsError ? (
                    <Alert color="red" mb="md">
                        {savedProductsError}
                    </Alert>
                ) : savedProducts.length === 0 ? (
                    <Paper p="xl" ta="center" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                        <IconHeart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--mantine-color-gray-5)' }} />
                        <Title order={4} c="dimmed" mb="xs">No Saved Products</Title>
                        <Text size="sm" c="dimmed" mb="lg">
                            Start exploring and save products you're interested in!
                        </Text>
                        <Button onClick={() => navigate('/products')}>
                            Browse Products
                        </Button>
                    </Paper>
                ) : (
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                        {savedProducts.map((product) => (
                            <Card key={product.id} p="md" withBorder className="hover-card">
                                <Stack gap="sm">
                                    {/* Product Header */}
                                    <Group justify="space-between" align="flex-start">
                                        <Group gap="sm" style={{ flex: 1 }}>
                                            {product.logo && (
                                                <Image
                                                    src={product.logo}
                                                    alt={product.name}
                                                    w={40}
                                                    h={40}
                                                    radius="md"
                                                    fallbackSrc="/placeholder-product.png"
                                                />
                                            )}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <Text fw={600} size="sm" lineClamp={1}>
                                                    {product.name}
                                                </Text>
                                                <Text size="xs" c="dimmed" lineClamp={1}>
                                                    {product.provider || product.institutionName || 'Unknown Provider'}
                                                </Text>
                                            </div>
                                        </Group>
                                        <Tooltip label="Remove from saved">
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                size="sm"
                                                loading={removingProducts.has(product.id)}
                                                onClick={() => handleRemoveSavedProduct(product.id)}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>

                                    {/* Product Type Badge */}
                                    {product.categoryName && (
                                        <Badge
                                            size="xs"
                                            variant="light"
                                            color={
                                                product.categoryName.toLowerCase().includes('card') ? 'blue' :
                                                    product.categoryName.toLowerCase().includes('loan') ? 'orange' :
                                                        product.categoryName.toLowerCase().includes('saving') ? 'green' : 'gray'
                                            }
                                        >
                                            {product.categoryName}
                                        </Badge>
                                    )}

                                    {/* Product Description */}
                                    {product.description && (
                                        <Text size="xs" c="dimmed" lineClamp={2}>
                                            {product.description}
                                        </Text>
                                    )}

                                    {/* Key Features */}
                                    {(product.interestRate || product.annualFee || product.rating) && (
                                        <div>
                                            <Divider size="xs" mb="xs" />
                                            <Group gap="xs" justify="space-between">
                                                {product.interestRate && (
                                                    <Text size="xs" c="dimmed">
                                                        Rate: {product.interestRate}%
                                                    </Text>
                                                )}
                                                {product.annualFee && (
                                                    <Text size="xs" c="dimmed">
                                                        Fee: LKR {product.annualFee.toLocaleString()}
                                                    </Text>
                                                )}
                                                {product.rating && (
                                                    <Badge size="xs" color="yellow">
                                                        ★ {product.rating}
                                                    </Badge>
                                                )}
                                            </Group>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <Group gap="xs" mt="sm">
                                        <Button
                                            size="xs"
                                            variant="light"
                                            leftSection={<IconExternalLink size={14} />}
                                            onClick={() => handleViewProduct(product.id)}
                                            style={{ flex: 1 }}
                                        >
                                            View Details
                                        </Button>
                                    </Group>
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Card>
        </Container>
    );
}

export default Profile;
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    Title,
    Text,
    Group,
    Stack,
    Button,
    Select,
    NumberInput,
    TextInput,
    Slider,
    Checkbox,
    ActionIcon,
    SimpleGrid,
    Paper,
    Badge,
    Box,
    Breadcrumbs,
    Anchor,
    Drawer,
    Divider,
    Pagination,
    rem,
    Rating,
    Loader
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconFilter,
    IconSortDescending,
    IconGridDots,
    IconList,
    IconHeart,
    IconHeartFilled,
    IconScale,
    IconScale as IconScaleFilled,
    IconSearch,
    IconX
} from '@tabler/icons-react';

import { ProductsService } from '../types/products/services/ProductsService';
import type { Product } from '../types/products/models/Product';
import type { ProductCategory } from '../types/products/models/ProductCategory';
import { OrganizationsService } from '../types/user/services/OrganizationsService';
import type { Organization } from '../types/user/models/Organization';
import { useComparison } from '../context/ComparisonContext';

// Utility function to safely extract product details
const getProductDetail = (product: Product, key: string, fallback: any = null) => {
    return (product.details as any)?.[key] ?? fallback;
};

// Utility function to format field names to human readable format
const formatFieldName = (key: string): string => {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to spaces
        .replace(/_/g, ' ') // snake_case to spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // capitalize first letters
};

// Utility function to format field values
const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
        // Check if it looks like a percentage
        if (value <= 100 && (value % 1 !== 0 || value < 10)) {
            return `${value}%`;
        }
        // Check if it looks like money (large numbers)
        if (value >= 1000) {
            return `LKR ${value.toLocaleString()}`;
        }
        return value.toString();
    }
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    if (typeof value === 'object') {
        // Handle ranges
        if (value.min !== undefined && value.max !== undefined) {
            return `${value.min} - ${value.max}`;
        }
        // Handle other objects
        return JSON.stringify(value).slice(1, -1); // Remove outer braces
    }
    return value.toString();
};

// Get relevant details to display for a product
const getDisplayableDetails = (product: Product): Array<{ key: string, label: string, value: string }> => {
    if (!product.details) return [];

    const details = product.details as any;
    const displayDetails: Array<{ key: string, label: string, value: string }> = [];

    // Priority fields to show first
    const priorityFields = ['interestRate', 'annualFee', 'maximumAmount', 'minimumAmount', 'creditLimit', 'premium', 'fee'];

    // First add priority fields
    priorityFields.forEach(field => {
        if (details[field] !== undefined && details[field] !== null) {
            displayDetails.push({
                key: field,
                label: formatFieldName(field),
                value: formatFieldValue(details[field])
            });
        }
    });

    // Then add other fields (excluding arrays and complex objects for grid view)
    Object.entries(details).forEach(([key, value]) => {
        if (!priorityFields.includes(key) &&
            typeof value !== 'object' &&
            !Array.isArray(value) &&
            value !== null &&
            value !== undefined) {
            displayDetails.push({
                key,
                label: formatFieldName(key),
                value: formatFieldValue(value)
            });
        }
    });

    return displayDetails.slice(0, 4); // Limit to 4 details for grid view
};

const Products: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1, // Ensure we start with page 1 (not 0)
        totalPages: 1,
        limit: 20
    });

    // Comparison context
    const { comparisonProducts, addToComparison, removeFromComparison, isInComparison } = useComparison();

    // Get filters from URL params or set defaults
    const getInitialFilters = () => ({
        category: searchParams.get('category') || 'all',
        institutionId: searchParams.get('institutionId') || '',
        search: searchParams.get('search') || '',
        minAmount: Number(searchParams.get('minAmount')) || 0,
        maxAmount: Number(searchParams.get('maxAmount')) || 1000000,
        minRate: Number(searchParams.get('minRate')) || 0,
        maxRate: Number(searchParams.get('maxRate')) || 30,
        providers: searchParams.get('providers')?.split(',').filter(Boolean) || [],
        features: searchParams.get('features')?.split(',').filter(Boolean) || [],
        sortBy: searchParams.get('sortBy') || 'rating',
    });

    const [filters, setFilters] = useState(getInitialFilters);

    // Update URL when filters change and reset pagination
    useEffect(() => {
        const params = new URLSearchParams();

        if (filters.category !== 'all') params.set('category', filters.category);
        if (filters.institutionId) params.set('institutionId', filters.institutionId);
        if (filters.search) params.set('search', filters.search);
        if (filters.minAmount > 0) params.set('minAmount', filters.minAmount.toString());
        if (filters.maxAmount < 1000000) params.set('maxAmount', filters.maxAmount.toString());
        if (filters.minRate > 0) params.set('minRate', filters.minRate.toString());
        if (filters.maxRate < 30) params.set('maxRate', filters.maxRate.toString());
        if (filters.providers.length > 0) params.set('providers', filters.providers.join(','));
        if (filters.features.length > 0) params.set('features', filters.features.join(','));
        if (filters.sortBy !== 'rating') params.set('sortBy', filters.sortBy);

        setSearchParams(params, { replace: true });

        // Reset to first page when filters change
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, [filters, setSearchParams]);

    // Find current category from API data or use default
    const getCurrentCategory = () => {
        if (filters.category === 'all') {
            return {
                title: 'All Products',
                description: 'Browse all available financial products',
                icon: '🔍',
                slug: 'all'
            };
        }
        const apiCategory = categories.find(cat => cat.id === filters.category);
        if (apiCategory) {
            return {
                title: apiCategory.name || 'Unknown Category',
                description: apiCategory.description || 'Financial products',
                icon: '📋',
                slug: apiCategory.id || 'unknown'
            };
        }
        // Fallback to static categories
        const staticCategories = {
            'credit-cards': { title: 'Credit Cards', description: 'Find the perfect credit card with rewards, cashback, and low fees', icon: '💳', slug: 'credit-cards' },
            'loans': { title: 'Personal Loans', description: 'Compare personal loans with competitive rates and flexible terms', icon: '💰', slug: 'loans' },
            'mortgages': { title: 'Home Loans', description: 'Secure your dream home with the best mortgage rates', icon: '🏠', slug: 'mortgages' },
            'insurance': { title: 'Insurance', description: 'Protect what matters most with comprehensive insurance coverage', icon: '🛡️', slug: 'insurance' },
            'investments': { title: 'Investments', description: 'Grow your wealth with smart investment opportunities', icon: '📈', slug: 'investments' },
            'savings': { title: 'Savings Accounts', description: 'Earn more on your money with high-yield savings accounts', icon: '🏦', slug: 'savings' }
        };
        return staticCategories[filters.category as keyof typeof staticCategories] || staticCategories['credit-cards'];
    };

    const currentCategory = getCurrentCategory();

    // Fetch categories from API
    const fetchCategories = useCallback(async () => {
        try {
            const response = await ProductsService.getProductsCategories();
            // Handle both array response and wrapped response with data property
            if (Array.isArray(response)) {
                setCategories(response);
            } else if (response && (response as any).data && Array.isArray((response as any).data)) {
                setCategories((response as any).data);
            } else {
                setCategories([]);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    }, []);

    // Fetch organizations from API
    const fetchOrganizations = useCallback(async () => {
        try {
            const response = await OrganizationsService.getOrgs(1, 100); // Get first 100 orgs
            setOrganizations(response.items || []);
        } catch (err) {
            console.error('Error fetching organizations:', err);
        } finally {
            setLoadingFilters(false);
        }
    }, []);

    // Load initial filter data
    useEffect(() => {
        const loadFilterData = async () => {
            setLoadingFilters(true);
            await Promise.all([
                fetchCategories(),
                fetchOrganizations()
            ]);
        };
        loadFilterData();
    }, [fetchCategories, fetchOrganizations]);

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Map frontend sort options to backend-supported values
            const getSortField = (sortBy: string): 'name' | 'createdAt' | 'updatedAt' => {
                switch (sortBy) {
                    case 'name':
                        return 'name';
                    case 'rating':
                    case 'interestRate':
                    case 'fees':
                    default:
                        return 'createdAt'; // Default to createdAt for unsupported sorts
                }
            };

            // Ensure page is always >= 1 for API validation
            const pageNumber = Math.max(1, pagination.currentPage);

            const response = await ProductsService.getProducts(
                filters.category !== 'all' ? filters.category : undefined,
                filters.institutionId || undefined, // institutionId from filter
                true, // isActive
                undefined, // isFeatured
                undefined, // productIds
                pageNumber, // Use page number directly (API expects page >= 1)
                pagination.limit,
                getSortField(filters.sortBy),
                'desc',
                filters.search || undefined
            );

            if (response.data) {
                setProducts(response.data as Product[]);
                if (response.meta) {
                    setPagination(prev => ({
                        total: response.meta.total || 0,
                        currentPage: prev.currentPage, // Keep the current page we requested
                        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20)),
                        limit: response.meta.limit || 20
                    }));
                }
            }
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [filters.category, filters.institutionId, filters.search, filters.sortBy, pagination.currentPage, pagination.limit]);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Apply client-side filtering for providers and amount/rate ranges
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Provider filter
            if (filters.providers.length > 0) {
                const details = product.details as any;
                const providerName = details?.provider ||
                    details?.institution ||
                    details?.bank ||
                    (product as any).category?.name ||
                    'Unknown';
                if (!filters.providers.includes(providerName)) {
                    return false;
                }
            }

            // Amount filter - check product details for amount-related fields
            if (product.details) {
                const details = product.details as any;
                const maxAmount = details.maximumAmount ||
                    details.maximumLoanAmount ||
                    details.creditLimit ||
                    details.maxAmount ||
                    details.coverageAmount;
                const minAmount = details.minimumAmount ||
                    details.minimumLoanAmount ||
                    details.minAmount ||
                    details.minInitialInvestment ||
                    0;

                if (maxAmount && (maxAmount < filters.minAmount || minAmount > filters.maxAmount)) {
                    return false;
                }
            }

            // Interest rate filter - check product details for rate-related fields
            if (product.details) {
                const details = product.details as any;
                const interestRate = details.interestRate ||
                    details.minimumInterestRate ||
                    details.rate ||
                    details.interestRateOrRental ||
                    details.dividendYield;

                if (interestRate && (interestRate < filters.minRate || interestRate > filters.maxRate)) {
                    return false;
                }
            }

            return true;
        });
    }, [products, filters.providers, filters.minAmount, filters.maxAmount, filters.minRate, filters.maxRate]);

    const handleProductClick = (productId: string | null | undefined) => {
        if (productId) {
            navigate(`/product/${productId}`);
        }
    };

    const handleCompareToggle = (product: Product) => {
        const isSelected = isInComparison(product.id || '');
        if (isSelected && product.id) {
            removeFromComparison(product.id);
        } else if (product.id) {
            addToComparison(product);
        }
    };

    const handleSaveToggle = (productId: string | null | undefined) => {
        if (productId) {
            // Removed saved product logic
        }
    };

    const handlePageChange = (page: number) => {
        // Ensure page is always >= 1 as required by the API
        const safePage = Math.max(1, page);
        setPagination(prev => ({ ...prev, currentPage: safePage }));
    };

    const clearAllFilters = () => {
        setFilters({
            category: 'all',
            institutionId: '',
            search: '',
            minAmount: 0,
            maxAmount: 1000000,
            minRate: 0,
            maxRate: 30,
            providers: [],
            features: [],
            sortBy: 'rating',
        });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const breadcrumbItems = [
        { title: 'Home', href: '/' },
        { title: 'Products', href: '/products' },
    ].map((item, index) => (
        <Anchor key={index} href={item.href} size="sm">
            {item.title}
        </Anchor>
    ));

    const uniqueProviders = useMemo(() => {
        const providers = new Set<string>();
        products.forEach(product => {
            const details = product.details as any;
            // Try different provider field variations
            const provider = details?.provider ||
                details?.institution ||
                details?.bank ||
                (product as any).category?.name ||
                'Unknown';
            providers.add(provider);
        });
        return Array.from(providers);
    }, [products]);

    const hasActiveFilters = filters.category !== 'all' || filters.institutionId || filters.search || filters.minAmount > 0 ||
        filters.maxAmount < 1000000 || filters.minRate > 0 || filters.maxRate < 30 ||
        filters.providers.length > 0 || filters.features.length > 0;

    const FilterContent = () => (
        <Stack gap="lg">
            {/* Category Filter */}
            <Box>
                <Text size="sm" fw={500} mb="xs">Category</Text>
                <Select
                    value={filters.category}
                    onChange={(value) => value && setFilters(prev => ({ ...prev, category: value }))}
                    data={[
                        { value: 'all', label: 'All Categories' },
                        ...categories
                            .sort((a, b) => {
                                // Sort by level first, then by name
                                if (a.level !== b.level) {
                                    return (a.level || 0) - (b.level || 0);
                                }
                                return (a.name || '').localeCompare(b.name || '');
                            })
                            .map((cat) => {
                                // Create indented labels based on category level
                                const indent = '  '.repeat(cat.level || 0);
                                const levelPrefix = cat.level === 0 ? '📁 ' : cat.level === 1 ? '📂 ' : '📄 ';
                                return {
                                    value: cat.id || '',
                                    label: `${indent}${levelPrefix}${cat.name || 'Unknown Category'}`
                                };
                            })
                    ]}
                    searchable
                    placeholder={loadingFilters ? "Loading categories..." : "Select category"}
                    disabled={loadingFilters}
                />
            </Box>

            {/* Search Filter */}
            <Box>
                <Text size="sm" fw={500} mb="xs">Search</Text>
                <Group>
                    <TextInput
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(event) => setFilters(prev => ({ ...prev, search: event.currentTarget.value }))}
                        flex={1}
                        leftSection={<IconSearch size={16} />}
                    />
                    {filters.search && (
                        <ActionIcon
                            variant="light"
                            color="gray"
                            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                        >
                            <IconX size={16} />
                        </ActionIcon>
                    )}
                </Group>
            </Box>

            {/* Amount Range */}
            <Box>
                <Text size="sm" fw={500} mb="xs">Amount Range (LKR)</Text>
                <Group gap="xs">
                    <NumberInput
                        placeholder="Min"
                        value={filters.minAmount}
                        onChange={(value) => setFilters(prev => ({ ...prev, minAmount: Number(value) || 0 }))}
                        size="xs"
                        hideControls
                        flex={1}
                    />
                    <Text size="xs" c="dimmed">to</Text>
                    <NumberInput
                        placeholder="Max"
                        value={filters.maxAmount}
                        onChange={(value) => setFilters(prev => ({ ...prev, maxAmount: Number(value) || 1000000 }))}
                        size="xs"
                        hideControls
                        flex={1}
                    />
                </Group>
            </Box>

            {/* Interest Rate */}
            <Box>
                <Text size="sm" fw={500} mb="xs">Max Interest Rate: {filters.maxRate}%</Text>
                <Slider
                    value={filters.maxRate}
                    onChange={(value) => setFilters(prev => ({ ...prev, maxRate: value }))}
                    max={30}
                    step={0.5}
                    marks={[
                        { value: 0, label: '0%' },
                        { value: 15, label: '15%' },
                        { value: 30, label: '30%' },
                    ]}
                />
            </Box>

            {/* Institutions */}
            <Box>
                <Text size="sm" fw={500} mb="xs">Institutions</Text>
                <Select
                    value={filters.institutionId}
                    onChange={(value) => setFilters(prev => ({ ...prev, institutionId: value || '' }))}
                    data={[
                        { value: '', label: 'All Institutions' },
                        ...organizations.map((org) => ({
                            value: org.id || '',
                            label: org.name || 'Unknown Institution'
                        }))
                    ]}
                    searchable
                    placeholder={loadingFilters ? "Loading institutions..." : "Select institution"}
                    disabled={loadingFilters}
                    clearable
                />
            </Box>

            {/* Providers */}
            <Box>
                <Text size="sm" fw={500} mb="xs">Providers</Text>
                <Stack gap="xs" mah={200} style={{ overflow: 'auto' }}>
                    {uniqueProviders.map(provider => (
                        <Checkbox
                            key={provider}
                            label={provider}
                            checked={filters.providers.includes(provider)}
                            onChange={(event) => {
                                const checked = event.currentTarget.checked;
                                setFilters(prev => ({
                                    ...prev,
                                    providers: checked
                                        ? [...prev.providers, provider]
                                        : prev.providers.filter(p => p !== provider)
                                }));
                            }}
                            size="sm"
                        />
                    ))}
                </Stack>
            </Box>

            {hasActiveFilters && (
                <Button variant="outline" fullWidth onClick={clearAllFilters}>
                    Clear All Filters
                </Button>
            )}
        </Stack>
    );

    return (
        <Container size="xl">
            {/* Breadcrumbs */}
            <Breadcrumbs mb="md" className="animate-fadeInUp">
                {breadcrumbItems}
            </Breadcrumbs>

            {/* Header */}
            <Box className="animate-fadeInUp animate-delay-1" mb="xl">
                <Group gap="md" align="center" mb="md">
                    <Text size={rem(40)}>{currentCategory.icon}</Text>
                    <div>
                        <Title order={1} size="h2" fw={700}>
                            {currentCategory.title}
                        </Title>
                        <Text c="dimmed" size="lg">
                            {currentCategory.description}
                        </Text>
                    </div>
                </Group>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <Paper p="md" withBorder radius="md" bg="blue.0">
                        <Group gap="xs" mb="xs">
                            <Text size="sm" fw={500}>Active filters:</Text>
                            {filters.category !== 'all' && (
                                <Badge variant="outline" size="sm">
                                    Category: {(() => {
                                        const selectedCategory = categories.find(cat => cat.id === filters.category);
                                        if (selectedCategory) {
                                            // Build category path: Parent > Child format
                                            let path = selectedCategory.name || 'Unknown';
                                            if (selectedCategory.parent) {
                                                path = `${selectedCategory.parent.name} > ${path}`;
                                            }
                                            return path;
                                        }
                                        return currentCategory.title;
                                    })()}
                                </Badge>
                            )}
                            {filters.institutionId && (
                                <Badge variant="outline" size="sm">
                                    Institution: {organizations.find(org => org.id === filters.institutionId)?.name || 'Unknown'}
                                </Badge>
                            )}
                            {filters.search && (
                                <Badge variant="outline" size="sm">
                                    Search: "{filters.search}"
                                </Badge>
                            )}
                            {filters.providers.map(provider => (
                                <Badge key={provider} variant="outline" size="sm">
                                    {provider}
                                </Badge>
                            ))}
                        </Group>
                        <Text size="sm">
                            {filteredProducts.length} products found
                        </Text>
                    </Paper>
                )}
            </Box>

            <Grid gutter="xl">
                {/* Sidebar Filters - Desktop */}
                <Grid.Col span={{ base: 12, md: 3 }} visibleFrom="md">
                    <Card p="lg" withBorder className="animate-fadeInLeft animate-delay-2" pos="sticky" top={20}>
                        <Title order={3} size="h5" mb="md">
                            Filters
                        </Title>
                        <FilterContent />
                    </Card>
                </Grid.Col>

                {/* Main Content */}
                <Grid.Col span={{ base: 12, md: 9 }}>
                    {/* Toolbar */}
                    <Group justify="space-between" mb="lg" className="animate-fadeInRight animate-delay-2">
                        <Group gap="md">
                            <Text size="sm" c="dimmed">
                                {filteredProducts.length} products found
                            </Text>

                            {/* Mobile Filter Button */}
                            <Button
                                variant="outline"
                                leftSection={<IconFilter size={16} />}
                                hiddenFrom="md"
                                onClick={openFilter}
                            >
                                Filters
                                {hasActiveFilters && (
                                    <Badge size="xs" circle ml="xs">
                                        !
                                    </Badge>
                                )}
                            </Button>
                        </Group>

                        <Group gap="md">
                            <Select
                                value={filters.sortBy}
                                onChange={(value) => value && setFilters(prev => ({ ...prev, sortBy: value }))}
                                data={[
                                    { value: 'rating', label: 'Highest Rated' },
                                    { value: 'interestRate', label: 'Lowest Interest Rate' },
                                    { value: 'fees', label: 'Lowest Fees' },
                                    { value: 'name', label: 'Name A-Z' },
                                ]}
                                leftSection={<IconSortDescending size={16} />}
                                size="sm"
                                w={180}
                            />

                            <Group gap={4}>
                                <ActionIcon
                                    variant={viewMode === 'grid' ? 'filled' : 'outline'}
                                    onClick={() => setViewMode('grid')}
                                    size="lg"
                                >
                                    <IconGridDots size={16} />
                                </ActionIcon>
                                <ActionIcon
                                    variant={viewMode === 'list' ? 'filled' : 'outline'}
                                    onClick={() => setViewMode('list')}
                                    size="lg"
                                >
                                    <IconList size={16} />
                                </ActionIcon>
                            </Group>
                        </Group>
                    </Group>

                    {/* Loading State */}
                    {loading && (
                        <Paper p="xl" ta="center">
                            <Loader size="lg" />
                            <Text mt="md" c="dimmed">Loading products...</Text>
                        </Paper>
                    )}

                    {/* Error State */}
                    {error && (
                        <Paper p="xl" ta="center" bg="red.0">
                            <Text c="red" mb="md">{error}</Text>
                            <Button variant="outline" onClick={fetchProducts}>
                                Try Again
                            </Button>
                        </Paper>
                    )}

                    {/* Products Grid/List */}
                    {!loading && !error && (viewMode === 'grid' ? (
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="lg">
                            {filteredProducts.map((product, index) => (
                                <Card
                                    key={product.id}
                                    p="lg"
                                    radius="md"
                                    withBorder
                                    className={`hover-lift animate-fadeInUp animate-delay-${(index % 4) + 1}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Stack gap="sm" h="100%">
                                        <Group justify="space-between" align="flex-start">
                                            <div style={{ flex: 1 }} onClick={() => handleProductClick(product.id)}>
                                                <Text size="lg" fw={600} lineClamp={1}>
                                                    {product.name}
                                                </Text>
                                                <Text size="sm" c="blue" fw={500}>
                                                    {getProductDetail(product, 'provider') ||
                                                        getProductDetail(product, 'institution') ||
                                                        (product as any).category?.name ||
                                                        'Unknown Provider'}
                                                </Text>
                                            </div>
                                            <Group gap={4}>
                                                <ActionIcon
                                                    variant="light"
                                                    color={'gray'}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSaveToggle(product.id);
                                                    }}
                                                >
                                                    {/* Removed saved product UI (heart icon) */}
                                                </ActionIcon>
                                                <ActionIcon
                                                    variant="light"
                                                    color={isInComparison(product.id || '') ? 'blue' : 'gray'}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCompareToggle(product);
                                                    }}
                                                >
                                                    {isInComparison(product.id || '') ? (
                                                        <IconScaleFilled size={16} />
                                                    ) : (
                                                        <IconScale size={16} />
                                                    )}
                                                </ActionIcon>
                                            </Group>
                                        </Group>

                                        <div onClick={() => handleProductClick(product.id)} style={{ flex: 1 }}>
                                            <Text size="sm" c="dimmed" lineClamp={2} mb="sm">
                                                {getProductDetail(product, 'description') ||
                                                    getProductDetail(product, 'purpose') ||
                                                    (product as any).category?.description ||
                                                    'No description available'}
                                            </Text>

                                            <Group gap="xs" mb="sm">
                                                <Rating value={getProductDetail(product, 'rating', 0)} fractions={2} readOnly size="sm" />
                                                <Text size="sm" c="dimmed">
                                                    ({getProductDetail(product, 'rating', 0)})
                                                </Text>
                                            </Group>

                                            <Stack gap="xs">
                                                {getDisplayableDetails(product).map(detail => (
                                                    <Group key={detail.key} justify="space-between">
                                                        <Text size="sm" c="dimmed">{detail.label}</Text>
                                                        <Text size="sm" fw={600}>{detail.value}</Text>
                                                    </Group>
                                                ))}
                                            </Stack>
                                        </div>

                                        <Button
                                            variant="light"
                                            fullWidth
                                            onClick={() => handleProductClick(product.id)}
                                        >
                                            View Details
                                        </Button>
                                    </Stack>
                                </Card>
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Stack gap="md">
                            {filteredProducts.map((product, index) => (
                                <Card
                                    key={product.id}
                                    p="lg"
                                    radius="md"
                                    withBorder
                                    className={`hover-lift animate-fadeInUp animate-delay-${(index % 4) + 1}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    <Group justify="space-between" align="flex-start">
                                        <div style={{ flex: 1 }}>
                                            <Group gap="md" align="flex-start">
                                                <div style={{ flex: 1 }}>
                                                    <Text size="lg" fw={600} mb="xs">
                                                        {product.name}
                                                    </Text>
                                                    <Text size="sm" c="blue" fw={500} mb="sm">
                                                        {getProductDetail(product, 'provider') ||
                                                            getProductDetail(product, 'institution') ||
                                                            (product as any).category?.name ||
                                                            'Unknown Provider'}
                                                    </Text>
                                                    <Text size="sm" c="dimmed" mb="sm">
                                                        {getProductDetail(product, 'description') ||
                                                            getProductDetail(product, 'purpose') ||
                                                            (product as any).category?.description ||
                                                            'No description available'}
                                                    </Text>
                                                    <Group gap="xs">
                                                        <Rating value={getProductDetail(product, 'rating', 0)} fractions={2} readOnly size="sm" />
                                                        <Text size="sm" c="dimmed">
                                                            ({getProductDetail(product, 'rating', 0)})
                                                        </Text>
                                                    </Group>
                                                </div>
                                                <Group gap="xl" align="center">
                                                    {getDisplayableDetails(product).slice(0, 2).map(detail => (
                                                        <div key={detail.key} style={{ textAlign: 'center' }}>
                                                            <Text size="xs" c="dimmed" mb={2}>{detail.label}</Text>
                                                            <Text size="lg" fw={700} c="green">{detail.value}</Text>
                                                        </div>
                                                    ))}
                                                    <Group gap={4}>
                                                        <ActionIcon
                                                            variant="light"
                                                            color={'gray'}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSaveToggle(product.id);
                                                            }}
                                                        >
                                                            {/* Removed saved product UI (heart icon) */}
                                                        </ActionIcon>
                                                        <ActionIcon
                                                            variant="light"
                                                            color={isInComparison(product.id || '') ? 'blue' : 'gray'}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCompareToggle(product);
                                                            }}
                                                        >
                                                            {isInComparison(product.id || '') ? (
                                                                <IconScaleFilled size={16} />
                                                            ) : (
                                                                <IconScale size={16} />
                                                            )}
                                                        </ActionIcon>
                                                    </Group>
                                                </Group>
                                            </Group>
                                        </div>
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    ))}

                    {!loading && !error && filteredProducts.length === 0 && (
                        <Paper p="xl" ta="center" mt="xl">
                            <Text size="lg" c="dimmed" mb="md">
                                No products found matching your criteria
                            </Text>
                            <Button variant="outline" onClick={clearAllFilters}>
                                Clear All Filters
                            </Button>
                        </Paper>
                    )}

                    {/* Pagination */}
                    {!loading && !error && pagination.totalPages > 1 && (
                        <Group justify="center" mt="xl">
                            <Pagination
                                total={pagination.totalPages}
                                value={pagination.currentPage}
                                onChange={handlePageChange}
                                size="md"
                            />
                            <Text size="sm" c="dimmed">
                                Page {pagination.currentPage} of {pagination.totalPages}
                                ({pagination.total} products total)
                            </Text>
                        </Group>
                    )}
                </Grid.Col>
            </Grid>

            {/* Mobile Filter Drawer */}
            <Drawer
                opened={filterOpened}
                onClose={closeFilter}
                title="Filter Products"
                position="right"
                size="sm"
            >
                <FilterContent />
                <Divider my="md" />
                <Button fullWidth onClick={closeFilter}>
                    Apply Filters ({filteredProducts.length} products)
                </Button>
            </Drawer>
        </Container>
    );
};

export default Products;
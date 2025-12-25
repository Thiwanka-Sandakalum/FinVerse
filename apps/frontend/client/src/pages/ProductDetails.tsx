import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    Card,
    Badge,
    SimpleGrid,
    rem,
    Box,
    Grid,
    ActionIcon,
    Table,
    Tabs,
    Paper,
    ThemeIcon,
    Anchor,
    Breadcrumbs,
    Alert,
    Timeline,
    Avatar,
    Rating,
    Loader,
} from '@mantine/core';
import {
    IconArrowRight,
    IconStar,
    IconHeart,
    IconGitCompare,
    IconShare,
    IconCheck,
    IconAlertCircle,
    IconDownload,
    IconPhone,
    IconMail,
    IconMapPin,
    IconClock,
    IconShield,
    IconCalculator,
    IconCreditCard,
} from '@tabler/icons-react';

import { ProductsService } from '../types/products/services/ProductsService';
import { OrganizationsService } from '../types/user/services/OrganizationsService';
import type { Product } from '../types/products/models/Product';
import type { Organization } from '../types/user/models/Organization';
import { useComparison } from '../context/ComparisonContext';

// Utility function to safely extract product details
const getProductDetail = (product: Product, key: string, fallback: any = null) => {
    return (product.details as any)?.[key] ?? fallback;
};

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Comparison context
    const { isInComparison, addToComparison, removeFromComparison } = useComparison();
    const isInComparisonState = product?.id ? isInComparison(product.id) : false;
    const [isSavedState] = useState(false); // Removed unused setIsSavedState

    // Fetch product details
    useEffect(() => {
        const fetchProductAndOrg = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const response = await ProductsService.getProducts1(id);
                setProduct(response);

                // Fetch organization info
                if (response.institutionId) {
                    try {
                        const org = await OrganizationsService.getOrgs1(response.institutionId);
                        setOrganization(org);
                    } catch (orgErr) {
                        setOrganization(null);
                    }
                } else {
                    setOrganization(null);
                }

                // Fetch similar products based on category
                if (response.categoryId) {
                    const similarResponse = await ProductsService.getProducts(
                        response.categoryId,
                        undefined,
                        true,
                        undefined,
                        undefined,
                        1,
                        6
                    );
                    if (similarResponse.data) {
                        // Filter out current product from similar products
                        const filtered = (similarResponse.data as Product[]).filter(p => p.id !== id);
                        setSimilarProducts(filtered.slice(0, 3));
                    }
                }
            } catch (err) {
                setError('Failed to load product details');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndOrg();
    }, [id]);

    if (loading) {
        return (
            <Container size="xl">
                <Paper p="xl" ta="center">
                    <Loader size="lg" />
                    <Text mt="md" c="dimmed">Loading product details...</Text>
                </Paper>
            </Container>
        );
    }

    if (error || !product) {
        return (
            <Container size="xl">
                <Paper p="xl" ta="center">
                    <Text size="lg" c="dimmed">{error || 'Product not found'}</Text>
                    <Button mt="md" onClick={() => navigate('/products')}>
                        Back to Products
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Generate product details from API data
    const productDetails = {
        eligibility: {
            minAge: getProductDetail(product, 'minAge') || 21,
            maxAge: getProductDetail(product, 'maxAge') || 65,
            minIncome: getProductDetail(product, 'minimumIncome') || getProductDetail(product, 'minimumAmount') || 50000,
            creditScore: getProductDetail(product, 'creditScore') || 650,
            employment: getProductDetail(product, 'employment') || 'Salaried/Self-employed',
        },
        features: getProductDetail(product, 'features') || getProductDetail(product, 'specialBenefits') || [
            'Competitive interest rates',
            '24/7 customer support',
            'Online account management',
            'Mobile app access',
            'Secure transactions',
            'Quick processing',
        ],
        documents: getProductDetail(product, 'requiredDocuments') || [
            'National ID card',
            'Income proof',
            'Bank statements (3 months)',
            'Utility bill',
        ],
        reviews: [
            {
                id: '1',
                user: 'Customer A.',
                rating: 4,
                comment: 'Good product with competitive rates and excellent service.',
                date: '2024-10-15',
            },
            {
                id: '2',
                user: 'Customer B.',
                rating: 5,
                comment: 'Highly recommended! Easy application process.',
                date: '2024-10-10',
            },
            {
                id: '3',
                user: 'Customer C.',
                rating: 4,
                comment: 'Great features and reliable service.',
                date: '2024-10-08',
            },
        ],
        applicationProcess: [
            { title: 'Apply Online', description: 'Fill out the application form' },
            { title: 'Document Upload', description: 'Upload required documents' },
            { title: 'Verification', description: 'Institution verifies your information' },
            { title: 'Approval', description: 'Get approval within 3-5 business days' },
            { title: 'Product Activation', description: 'Activate your product' },
        ],
    };

    const handleCompareToggle = () => {
        if (isInComparisonState && product?.id) {
            removeFromComparison(product.id);
        } else if (product?.id) {
            addToComparison(product);
        }
    };

    const handleSaveToggle = () => {
        if (product?.id && isSavedState) {
            // Removed saved product logic
        } else if (product?.id) {
            // Removed saved product logic
        }
    };

    const breadcrumbItems = [
        { title: 'Home', href: '/' },
        { title: 'Products', href: '/products' },
        { title: product.name, href: '#' },
    ].map((item, index) => (
        <Anchor key={index} href={item.href} size="sm">
            {item.title}
        </Anchor>
    ));

    const isComparing = isInComparisonState;
    const isSaved = isSavedState;

    return (
        <Container size="xl">
            {/* Breadcrumbs */}
            <Breadcrumbs mb="md" className="animate-fadeInUp">
                {breadcrumbItems}
            </Breadcrumbs>

            {/* Product Header */}
            <Card p="xl" withBorder mb="xl" className="animate-fadeInUp animate-delay-1">
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Group gap="md" align="flex-start">
                            <ThemeIcon size={60} variant="light" color="finBlue">
                                <IconCreditCard size={30} />
                            </ThemeIcon>
                            <div style={{ flex: 1 }}>
                                <Group gap="xs" mb="xs">
                                    <Badge variant="light" color="finBlue" size="sm">
                                        {getProductDetail(product, 'type') || getProductDetail(product, 'productType') || 'Financial Product'}
                                    </Badge>
                                    <Group gap="xs">
                                        <IconStar size={16} fill="currentColor" color="gold" />
                                        <Text size="sm" fw={500}>{getProductDetail(product, 'rating') || '4.5'}</Text>
                                        <Text size="sm" c="dimmed">({productDetails.reviews.length} reviews)</Text>
                                    </Group>
                                </Group>
                                <Title order={1} size="h2" fw={700} mb="xs">
                                    {product.name}
                                </Title>
                                <Text size="lg" c="dimmed" mb="md">
                                    by {getProductDetail(product, 'provider') || getProductDetail(product, 'issuer') || 'Financial Institution'}
                                </Text>
                                <Text size="md" mb="lg" style={{ maxWidth: rem(600) }}>
                                    {getProductDetail(product, 'description') || getProductDetail(product, 'summary') || 'A comprehensive financial product designed to meet your needs.'}
                                </Text>

                                <Group gap="md">
                                    <Button
                                        size="lg"
                                        variant="gradient"
                                        gradient={{ from: 'finBlue.6', to: 'finGreen.6', deg: 135 }}
                                        rightSection={<IconArrowRight size={18} />}
                                    >
                                        Apply Now
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        leftSection={<IconCalculator size={18} />}
                                    >
                                        Calculate EMI
                                    </Button>
                                    <ActionIcon
                                        size="lg"
                                        variant="outline"
                                        color={isSaved ? 'red' : 'gray'}
                                        onClick={handleSaveToggle}
                                    >
                                        <IconHeart size={20} />
                                    </ActionIcon>
                                    <ActionIcon
                                        size="lg"
                                        variant="outline"
                                        color={isComparing ? 'blue' : 'gray'}
                                        onClick={handleCompareToggle}
                                    >
                                        <IconGitCompare size={20} />
                                    </ActionIcon>
                                    <ActionIcon size="lg" variant="outline">
                                        <IconShare size={20} />
                                    </ActionIcon>
                                </Group>
                            </div>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card p="lg" withBorder bg="gray.0">
                            <Title order={3} size="h5" mb="md">Key Features</Title>
                            <Stack gap="md">
                                {getProductDetail(product, 'interestRate') && (
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Interest Rate</Text>
                                        <Text size="lg" fw={700} c="red">
                                            {getProductDetail(product, 'interestRate')}% per annum
                                        </Text>
                                    </Group>
                                )}
                                {getProductDetail(product, 'annualFee') !== undefined && (
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Annual Fee</Text>
                                        <Text size="lg" fw={700}>
                                            {getProductDetail(product, 'annualFee') === 0 ? 'Free' : `LKR ${getProductDetail(product, 'annualFee')?.toLocaleString() || 'N/A'}`}
                                        </Text>
                                    </Group>
                                )}
                                {getProductDetail(product, 'maxAmount') && (
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Maximum Amount</Text>
                                        <Text size="lg" fw={700}>
                                            LKR {getProductDetail(product, 'maxAmount')?.toLocaleString()}
                                        </Text>
                                    </Group>
                                )}
                                {getProductDetail(product, 'minimumAmount') && (
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Minimum Amount</Text>
                                        <Text size="lg" fw={700}>
                                            LKR {getProductDetail(product, 'minimumAmount')?.toLocaleString()}
                                        </Text>
                                    </Group>
                                )}
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Processing Time</Text>
                                    <Text size="lg" fw={700}>
                                        {getProductDetail(product, 'processingTime') || '3-5 days'}
                                    </Text>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Card>

            {/* Product Details Tabs */}
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
                <Tabs.List grow>
                    <Tabs.Tab value="overview">Overview</Tabs.Tab>
                    <Tabs.Tab value="features">Features</Tabs.Tab>
                    <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                    <Tabs.Tab value="calculator">Calculator</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="xl">
                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Stack gap="xl">
                                <Box>
                                    <Title order={3} mb="md">Product Overview</Title>
                                    <Text mb="lg">
                                        {getProductDetail(product, 'description') || getProductDetail(product, 'summary') ||
                                            'This comprehensive financial product is designed to meet your specific needs with competitive rates, flexible terms, and exceptional customer service.'}
                                    </Text>

                                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                                        {productDetails.features.slice(0, 4).map((feature: string, index: number) => (
                                            <Group key={index} gap="sm" align="flex-start">
                                                <ThemeIcon size="sm" color="finGreen" variant="light">
                                                    <IconCheck size={12} />
                                                </ThemeIcon>
                                                <Text size="sm">{feature}</Text>
                                            </Group>
                                        ))}
                                    </SimpleGrid>
                                </Box>

                                {/* Dynamic Product Details Table */}
                                <Box mt="xl">
                                    <Title order={4} mb="md">Product Details</Title>
                                    <Table withColumnBorders withRowBorders striped highlightOnHover>
                                        <Table.Tbody>
                                            {Object.entries(product.details).map(([key, value]) => (
                                                <Table.Tr key={key}>
                                                    <Table.Td fw={500} style={{ textTransform: 'capitalize' }}>
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value?.toLocaleString?.() || String(value)}
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Box>

                                <Box>
                                    <Title order={3} mb="md">Why Choose This Product?</Title>
                                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                                        <Paper p="lg" withBorder ta="center">
                                            <ThemeIcon size="xl" color="finBlue" variant="light" mx="auto" mb="md">
                                                <IconShield size={24} />
                                            </ThemeIcon>
                                            <Text fw={600} mb="xs">Secure & Reliable</Text>
                                            <Text size="sm" c="dimmed">Bank-grade security with 24/7 monitoring</Text>
                                        </Paper>
                                        <Paper p="lg" withBorder ta="center">
                                            <ThemeIcon size="xl" color="finGreen" variant="light" mx="auto" mb="md">
                                                <IconClock size={24} />
                                            </ThemeIcon>
                                            <Text fw={600} mb="xs">Quick Processing</Text>
                                            <Text size="sm" c="dimmed">Fast approval within 3-5 business days</Text>
                                        </Paper>
                                        <Paper p="lg" withBorder ta="center">
                                            <ThemeIcon size="xl" color="finBlue" variant="light" mx="auto" mb="md">
                                                <IconPhone size={24} />
                                            </ThemeIcon>
                                            <Text fw={600} mb="xs">24/7 Support</Text>
                                            <Text size="sm" c="dimmed">Round-the-clock customer assistance</Text>
                                        </Paper>
                                    </SimpleGrid>
                                </Box>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Card p="lg" withBorder>
                                <Title order={4} mb="md">Need Help?</Title>
                                <Stack gap="md">
                                    <Group gap="sm">
                                        <ThemeIcon size="sm" color="finBlue" variant="light">
                                            <IconPhone size={14} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="sm" fw={500}>Call Us</Text>
                                            <Text size="xs" c="dimmed">
                                                {organization?.metadata?.contactPhone || 'N/A'}
                                            </Text>
                                        </div>
                                    </Group>
                                    <Group gap="sm">
                                        <ThemeIcon size="sm" color="finBlue" variant="light">
                                            <IconMail size={14} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="sm" fw={500}>Email</Text>
                                            <Text size="xs" c="dimmed">
                                                {organization?.metadata?.contactEmail || 'N/A'}
                                            </Text>
                                        </div>
                                    </Group>
                                    <Group gap="sm">
                                        <ThemeIcon size="sm" color="finBlue" variant="light">
                                            <IconMapPin size={14} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="sm" fw={500}>Visit Branch</Text>
                                            <Text size="xs" c="dimmed">
                                                {organization?.metadata?.headquartersAddress || 'N/A'}
                                            </Text>
                                        </div>
                                    </Group>
                                </Stack>
                                <Button fullWidth mt="md" variant="outline">
                                    Contact Support
                                </Button>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="features" pt="xl">
                    <Title order={3} mb="md">All Features & Benefits</Title>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        {productDetails.features.map((feature: string, index: number) => (
                            <Group key={index} gap="sm" align="flex-start">
                                <ThemeIcon size="sm" color="finGreen" variant="light">
                                    <IconCheck size={12} />
                                </ThemeIcon>
                                <Text size="sm">{feature}</Text>
                            </Group>
                        ))}
                    </SimpleGrid>
                </Tabs.Panel>

                <Tabs.Panel value="eligibility" pt="xl">
                    <Title order={3} mb="md">Eligibility Criteria</Title>
                    <Card p="lg" withBorder>
                        <Table>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td fw={500}>Age</Table.Td>
                                    <Table.Td>{productDetails.eligibility.minAge} - {productDetails.eligibility.maxAge} years</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td fw={500}>Minimum Income</Table.Td>
                                    <Table.Td>LKR {productDetails.eligibility.minIncome.toLocaleString()} per month</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td fw={500}>Credit Score</Table.Td>
                                    <Table.Td>{productDetails.eligibility.creditScore}+</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td fw={500}>Employment</Table.Td>
                                    <Table.Td>{productDetails.eligibility.employment}</Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Card>

                    <Alert mt="lg" icon={<IconAlertCircle size={16} />}>
                        Meeting the eligibility criteria doesn't guarantee approval. Final approval is subject to
                        bank's internal credit assessment and verification process.
                    </Alert>
                </Tabs.Panel>

                <Tabs.Panel value="documents" pt="xl">
                    <Title order={3} mb="md">Required Documents</Title>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        {productDetails.documents.map((document: string, index: number) => (
                            <Group key={index} gap="sm" align="flex-start">
                                <ThemeIcon size="sm" color="finBlue" variant="light">
                                    <IconDownload size={12} />
                                </ThemeIcon>
                                <Text size="sm">{document}</Text>
                            </Group>
                        ))}
                    </SimpleGrid>

                    <Alert mt="lg" icon={<IconAlertCircle size={16} />}>
                        Additional documents may be requested based on your profile and application.
                    </Alert>
                </Tabs.Panel>

                <Tabs.Panel value="reviews" pt="xl">
                    <Group justify="space-between" mb="lg">
                        <Title order={3}>Customer Reviews</Title>
                        <Group gap="xs">
                            <Rating value={Number(getProductDetail(product, 'rating')) || 4.5} readOnly size="sm" />
                            <Text size="sm" fw={500}>{getProductDetail(product, 'rating') || '4.5'}/5</Text>
                            <Text size="sm" c="dimmed">({productDetails.reviews.length} reviews)</Text>
                        </Group>
                    </Group>

                    <Stack gap="lg">
                        {productDetails.reviews.map((review) => (
                            <Card key={review.id} p="lg" withBorder>
                                <Group justify="space-between" mb="sm">
                                    <Group gap="sm">
                                        <Avatar size="sm" color="finBlue">
                                            {review.user[0]}
                                        </Avatar>
                                        <div>
                                            <Text size="sm" fw={500}>{review.user}</Text>
                                            <Text size="xs" c="dimmed">{review.date}</Text>
                                        </div>
                                    </Group>
                                    <Rating value={review.rating} readOnly size="sm" />
                                </Group>
                                <Text size="sm">{review.comment}</Text>
                            </Card>
                        ))}
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="apply" pt="xl">
                    <Title order={3} mb="md">Application Process</Title>
                    <Timeline>
                        {productDetails.applicationProcess.map((step, index) => (
                            <Timeline.Item key={index} title={step.title}>
                                <Text size="sm" c="dimmed">{step.description}</Text>
                            </Timeline.Item>
                        ))}
                    </Timeline>

                    <Card p="lg" withBorder mt="xl" bg="blue.0">
                        <Group justify="space-between" align="flex-start">
                            <div>
                                <Text fw={600} mb="xs">Ready to apply?</Text>
                                <Text size="sm" c="dimmed">
                                    Start your application now and get approved in minutes.
                                </Text>
                            </div>
                            <Button
                                variant="gradient"
                                gradient={{ from: 'finBlue.6', to: 'finGreen.6', deg: 135 }}
                                rightSection={<IconArrowRight size={16} />}
                            >
                                Apply Now
                            </Button>
                        </Group>
                    </Card>
                </Tabs.Panel>
            </Tabs>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <Box mt={rem(80)} className="animate-fadeInUp animate-delay-3">
                    <Title order={2} mb="lg">Similar Products</Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                        {similarProducts.map((similarProduct) => (
                            <Card
                                key={similarProduct.id}
                                p="lg"
                                radius="md"
                                withBorder
                                className="hover-lift"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/product/${similarProduct.id}`)}
                            >
                                <Stack gap="sm">
                                    <Group justify="space-between" align="flex-start">
                                        <Badge variant="light" color="finBlue" size="sm">
                                            {getProductDetail(similarProduct, 'type') ||
                                                getProductDetail(similarProduct, 'productType') ||
                                                'Financial Product'}
                                        </Badge>
                                        <Group gap="xs">
                                            <IconStar size={16} fill="currentColor" color="gold" />
                                            <Text size="sm" fw={500}>
                                                {getProductDetail(similarProduct, 'rating') || '4.5'}
                                            </Text>
                                        </Group>
                                    </Group>

                                    <Text size="lg" fw={600} lineClamp={2}>
                                        {similarProduct.name}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {getProductDetail(similarProduct, 'provider') ||
                                            getProductDetail(similarProduct, 'issuer') ||
                                            'Financial Institution'}
                                    </Text>

                                    {getProductDetail(similarProduct, 'interestRate') && (
                                        <Group justify="space-between">
                                            <Text size="sm" c="dimmed">Interest Rate</Text>
                                            <Text size="sm" fw={600} c="finGreen.6">
                                                {getProductDetail(similarProduct, 'interestRate')}% APR
                                            </Text>
                                        </Group>
                                    )}

                                    <Button
                                        variant="light"
                                        fullWidth
                                        rightSection={<IconArrowRight size={16} />}
                                        mt="auto"
                                    >
                                        View Details
                                    </Button>
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </Container>
    );
};

export default ProductDetails;

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Stack,
    Title,
    Group,
    Button,
    Card,
    Text,
    Badge,
    Tabs,
    Grid,
    Divider,

    List,
    SimpleGrid,
    Alert,
    Box,
    LoadingOverlay,
    Loader,
    ThemeIcon
} from '@mantine/core'
import {
    IconArrowLeft,
    IconEdit,
    IconChartBar,
    IconFileText,
    IconCurrency,
    IconCalendar,
    IconMoneybag,
    IconPercentage,
    IconInfoCircle,

    IconStar,
    IconCheck,
    IconX
} from '@tabler/icons-react'
import BarChartCard from '../../components/charts/BarChartCard'
import PieChartCard from '../../components/charts/PieChartCard'
import { useProducts } from '../../hooks/useProducts'
import type { Product } from '../../types/products'

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getProduct } = useProducts()
    const [product, setProduct] = useState<Product | null>(null)
    const [loadingProduct, setLoadingProduct] = useState(true)

    useEffect(() => {
        if (id) {
            setLoadingProduct(true)
            getProduct(id)
                .then((productData) => {
                    setProduct(productData)
                    setLoadingProduct(false)
                })
                .catch(() => {
                    setProduct(null)
                    setLoadingProduct(false)
                })
        }
    }, [id, getProduct])

    if (loadingProduct) {
        return (
            <Stack gap="lg">
                <Group>
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => navigate('/products')}
                    >
                        Back to Products
                    </Button>
                </Group>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <Loader size="md" />
                    </div>
                </Card>
            </Stack>
        )
    }

    if (!product) {
        return (
            <Stack gap="lg">
                <Group>
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => navigate('/products')}
                    >
                        Back to Products
                    </Button>
                </Group>
                <Alert
                    icon={<IconInfoCircle size="1rem" />}
                    title="Product Not Found"
                    color="red"
                >
                    The product you are looking for could not be found.
                </Alert>
            </Stack>
        )
    }

    // Format key names for display
    const formatKeyName = (key: string): string => {
        return key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize each word
    }

    // Get key metrics from details dynamically
    const getKeyMetrics = () => {
        const details = product?.details || {}
        const metrics: Array<{ key: string, value: any, icon: any, color: string }> = []

        // Priority order for common metrics
        const priorityKeys = [
            'interestRate', 'nav', 'fee', 'expenseRatio',
            'minimumAmount', 'minimumInvestment', 'downPayment',
            'maximumAmount', 'processingFee', 'valuationFee',
            'tenureRange', 'tenureMonths', 'processingTime'
        ]

        const colors = ['blue', 'green', 'orange', 'violet', 'red', 'pink', 'teal', 'cyan']
        let colorIndex = 0

        priorityKeys.forEach(key => {
            if (details[key] !== undefined && details[key] !== null) {
                const icon = key.toLowerCase().includes('rate') || key.toLowerCase().includes('ratio') || key.toLowerCase().includes('nav') || key.toLowerCase().includes('expense') ?
                    IconPercentage :
                    key.toLowerCase().includes('amount') || key.toLowerCase().includes('fee') || key.toLowerCase().includes('investment') || key.toLowerCase().includes('payment') || key.toLowerCase().includes('value') ?
                        IconMoneybag :
                        key.toLowerCase().includes('tenure') || key.toLowerCase().includes('time') || key.toLowerCase().includes('months') ?
                            IconCalendar :
                            IconInfoCircle

                metrics.push({
                    key,
                    value: details[key],
                    icon,
                    color: colors[colorIndex % colors.length]
                })
                colorIndex++
            }
        })

        return metrics.slice(0, 4) // Limit to 4 metrics
    }

    // Render details dynamically
    const renderDetailsSection = () => {
        const details = product?.details || {}
        const entries = Object.entries(details)

        // Separate arrays and objects from simple values
        const simpleEntries = entries.filter(([_, value]) =>
            !Array.isArray(value) && typeof value !== 'object'
        )
        const arrayEntries = entries.filter(([_, value]) => Array.isArray(value))
        const objectEntries = entries.filter(([_, value]) =>
            typeof value === 'object' && !Array.isArray(value) && value !== null
        )

        return (
            <Grid>
                {/* Simple Values */}
                {simpleEntries.length > 0 && (
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4} mb="md">Product Details</Title>
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                {simpleEntries.map(([key, value]) => (
                                    <Group key={key} justify="space-between" p="sm"
                                        style={{ borderRadius: '8px', backgroundColor: 'var(--mantine-color-gray-0)' }}>
                                        <Text fw={500} size="sm">{formatKeyName(key)}</Text>
                                        <Text fw={600} c="blue">{String(value)}</Text>
                                    </Group>
                                ))}
                            </SimpleGrid>
                        </Card>
                    </Grid.Col>
                )}

                {/* Arrays and Objects */}
                {(arrayEntries.length > 0 || objectEntries.length > 0) && (
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack gap="md">
                            {arrayEntries.map(([key, value]) => (
                                <Card key={key} shadow="sm" padding="lg" radius="md" withBorder>
                                    <Title order={5} mb="md">{formatKeyName(key)}</Title>
                                    <List icon={
                                        <ThemeIcon size="sm" variant="light" color="blue">
                                            <IconCheck size={12} />
                                        </ThemeIcon>
                                    }>
                                        {(value as string[]).map((item: string, index: number) => (
                                            <List.Item key={index} fz="sm">{item}</List.Item>
                                        ))}
                                    </List>
                                </Card>
                            ))}

                            {objectEntries.map(([key, value]) => (
                                <Card key={key} shadow="sm" padding="lg" radius="md" withBorder>
                                    <Title order={5} mb="md">{formatKeyName(key)}</Title>
                                    <Stack gap="xs">
                                        {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                                            <Group key={subKey} justify="space-between">
                                                <Text fw={500} size="sm">{formatKeyName(subKey)}</Text>
                                                <Text fw={600} c="blue" size="sm">{String(subValue)}</Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Card>
                            ))}
                        </Stack>
                    </Grid.Col>
                )}
            </Grid>
        )
    }

    // Dummy data for charts (since analytics aren't in the API response yet)
    const applicationStatusData = [
        { name: 'Approved', value: 75 },
        { name: 'Pending', value: 15 },
        { name: 'Rejected', value: 10 }
    ]

    const monthlyApplications = [
        { name: 'Jan', value: 12 },
        { name: 'Feb', value: 19 },
        { name: 'Mar', value: 23 },
        { name: 'Apr', value: 18 },
        { name: 'May', value: 25 },
        { name: 'Jun', value: 22 }
    ]

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <Group>
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => navigate('/products')}
                    >
                        Back to Products
                    </Button>
                </Group>

                <Button
                    variant="light"
                    leftSection={<IconEdit size={16} />}
                    onClick={() => navigate(`/products/${id}/edit`)}
                >
                    Edit Product
                </Button>
            </Group>

            {/* Product Header */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" align="flex-start">
                    <Stack gap="sm" flex={1}>
                        <Group align="flex-start" justify="space-between">
                            <div>
                                <Group gap="xs" mb="xs">
                                    <Title order={2}>{product.name}</Title>
                                    {product.isFeatured && (
                                        <ThemeIcon size="sm" variant="light" color="yellow">
                                            <IconStar size={12} />
                                        </ThemeIcon>
                                    )}
                                </Group>
                                <Text c="dimmed" size="sm" mb="xs">ID: {product.id}</Text>
                                <Group gap="xs" mb="md">
                                    <Badge variant="outline" color="blue">
                                        {(product as any).category?.name || `Category: ${product.categoryId}`}
                                    </Badge>
                                    <Badge color={product.isActive ? 'green' : 'red'}>
                                        {product.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Group>
                                <Text size="sm" c="dimmed">Institution: {product.institutionId}</Text>
                                {(product as any).category?.description && (
                                    <Text size="xs" c="dimmed" mt="xs">
                                        {(product as any).category.description}
                                    </Text>
                                )}
                            </div>
                        </Group>

                        {/* Key Metrics Grid - Dynamic */}
                        {getKeyMetrics().length > 0 && (
                            <SimpleGrid cols={{ base: 2, md: Math.min(4, getKeyMetrics().length) }} spacing="md" mt="md">
                                {getKeyMetrics().map(({ key, value, icon: Icon, color }) => (
                                    <Box
                                        key={key}
                                        ta="center"
                                        p="sm"
                                        style={{
                                            borderRadius: '8px',
                                            backgroundColor: `var(--mantine-color-${color}-0)`
                                        }}
                                    >
                                        <Group justify="center" gap="xs" mb="xs">
                                            <ThemeIcon size="sm" variant="light" color={color}>
                                                <Icon size={12} />
                                            </ThemeIcon>
                                            <Text fw={600} size="sm">{formatKeyName(key)}</Text>
                                        </Group>
                                        <Text size="xl" fw={700} c={color}>
                                            {typeof value === 'object' && value !== null && value.min !== undefined && value.max !== undefined
                                                ? `${value.min}-${value.max}${key.toLowerCase().includes('tenure') || key.toLowerCase().includes('month') ? ' months' : key.toLowerCase().includes('rate') || key.toLowerCase().includes('ratio') ? '%' : ''}`
                                                : typeof value === 'number'
                                                    ? key.toLowerCase().includes('rate') || key.toLowerCase().includes('ratio') || key.toLowerCase().includes('percentage')
                                                        ? `${value}%`
                                                        : key.toLowerCase().includes('amount') || key.toLowerCase().includes('fee') || key.toLowerCase().includes('payment') || key.toLowerCase().includes('investment')
                                                            ? `$${value.toLocaleString()}`
                                                            : value.toLocaleString()
                                                    : String(value)
                                            }
                                        </Text>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        )}
                    </Stack>
                </Group>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview">
                <Tabs.List>
                    <Tabs.Tab value="overview" leftSection={<IconFileText size={16} />}>
                        Details
                    </Tabs.Tab>
                    <Tabs.Tab value="pricing" leftSection={<IconCurrency size={16} />}>
                        Complete Info
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="md">
                    {renderDetailsSection()}
                </Tabs.Panel>

                <Tabs.Panel value="pricing" pt="md">
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Title order={4} mb="md">All Product Details</Title>
                                <Stack gap="sm">
                                    {Object.entries(product.details).map(([key, value]) => {
                                        if (Array.isArray(value) || typeof value === 'object') return null;
                                        return (
                                            <Group key={key} justify="space-between" p="sm"
                                                style={{ borderRadius: '6px', backgroundColor: 'var(--mantine-color-gray-0)' }}>
                                                <Text fw={500} size="sm">{formatKeyName(key)}</Text>
                                                <Text fw={600} c="blue" size="sm">{String(value)}</Text>
                                            </Group>
                                        );
                                    })}
                                </Stack>
                            </Card>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="md">
                                {/* Category Information */}
                                {(product as any).category && (
                                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                                        <Title order={4} mb="md">Category Information</Title>
                                        <Stack gap="sm">
                                            <Group justify="space-between">
                                                <Text fw={500}>Category Name</Text>
                                                <Badge variant="light" color="blue">
                                                    {(product as any).category.name}
                                                </Badge>
                                            </Group>
                                            <Group justify="space-between">
                                                <Text fw={500}>Description</Text>
                                                <Text size="sm" c="dimmed" ta="right" maw="200px">
                                                    {(product as any).category.description}
                                                </Text>
                                            </Group>
                                            <Group justify="space-between">
                                                <Text fw={500}>Level</Text>
                                                <Badge size="sm" color="violet">
                                                    Level {(product as any).category.level}
                                                </Badge>
                                            </Group>
                                        </Stack>
                                    </Card>
                                )}

                                {/* Product Metadata */}
                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Title order={4} mb="md">Product Metadata</Title>
                                    <Stack gap="sm">
                                        <Group justify="space-between">
                                            <Text fw={500}>Created</Text>
                                            <Text size="sm">
                                                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                            </Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text fw={500}>Last Updated</Text>
                                            <Text size="sm">
                                                {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
                                            </Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text fw={500}>Status</Text>
                                            <Badge color={product.isActive ? 'green' : 'red'}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text fw={500}>Featured</Text>
                                            <ThemeIcon
                                                size="sm"
                                                variant="light"
                                                color={product.isFeatured ? 'yellow' : 'gray'}
                                            >
                                                {product.isFeatured ? <IconCheck size={12} /> : <IconX size={12} />}
                                            </ThemeIcon>
                                        </Group>
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    )
}

export default ProductDetails
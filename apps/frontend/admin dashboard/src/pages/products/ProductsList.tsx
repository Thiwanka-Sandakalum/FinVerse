import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Title, Group, Button, Badge, Text, LoadingOverlay } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import DataTable from '../../components/tables/DataTable'
import { useProducts } from '../../hooks/useProducts'
import type { TableColumn } from '../../types'
import type { Product } from '../../types/products'

const ProductsList = () => {
    const navigate = useNavigate()
    const { products, loading, error, fetchProducts, deleteProduct } = useProducts()

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Product',
            sortable: true,
            render: (value, item: Product) => (
                <div>
                    <Text fw={600}>{value}</Text>
                    <Text size="xs" c="dimmed">{item.categoryId || 'No category'}</Text>
                </div>
            )
        },
        {
            key: 'institutionId',
            label: 'Institution',
            sortable: true
        },
        {
            key: 'isActive',
            label: 'Status',
            sortable: true,
            render: (value) => {
                return <Badge color={value ? 'green' : 'red'}>{value ? 'Active' : 'Inactive'}</Badge>
            }
        },
        {
            key: 'isFeatured',
            label: 'Featured',
            sortable: true,
            render: (value) => {
                return value ? <Badge color="yellow">Featured</Badge> : null
            }
        },
        {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            key: 'updatedAt',
            label: 'Updated',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
        }
    ]

    const filters = [
        {
            label: 'Status',
            key: 'isActive',
            options: [
                { label: 'Active', value: 'true' },
                { label: 'Inactive', value: 'false' }
            ]
        },
        {
            label: 'Featured',
            key: 'isFeatured',
            options: [
                { label: 'Featured', value: 'true' },
                { label: 'Not Featured', value: 'false' }
            ]
        }
    ]

    const handleView = (product: Product) => {
        if (product.id) {
            navigate(`/products/${product.id}`)
        }
    }

    const handleEdit = (product: Product) => {
        console.log('Edit product:', product)
        // TODO: Navigate to edit page or open modal
    }

    const handleDelete = (product: Product) => {
        if (!product.id) return

        modals.openConfirmModal({
            title: 'Delete Product',
            children: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteProduct(product.id!)
        })
    }

    return (
        <Stack gap="lg" pos="relative">
            <LoadingOverlay visible={loading} />

            <Group justify="space-between">
                <Title order={1}>Products</Title>
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => navigate('/products/create')}
                >
                    Add Product
                </Button>
            </Group>

            {error && (
                <Text c="red" size="sm">
                    {error}
                </Text>
            )}

            <DataTable
                data={products}
                columns={columns}
                searchable
                searchPlaceholder="Search products..."
                filters={filters}
                actions={{
                    view: handleView,
                    edit: handleEdit,
                    delete: handleDelete
                }}
                onRowClick={handleView}
                itemsPerPage={10}
            />
        </Stack>
    )
}

export default ProductsList
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Stack, Title, Group, Button, Card, Alert, Loader } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconArrowLeft, IconInfoCircle } from '@tabler/icons-react'
import ProductForm from './ProductForm'
import { useProducts } from '../../hooks/useProducts'
import type { Product } from '../../types/products'

const EditProduct = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getProduct, updateProduct } = useProducts()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        if (id) {
            setLoading(true)
            getProduct(id)
                .then((productData) => {
                    setProduct(productData)
                    console.log('Loaded product data:', productData)
                    setLoading(false)
                })
                .catch(() => {
                    setProduct(null)
                    setLoading(false)
                    notifications.show({
                        title: 'Error',
                        message: 'Failed to load product details',
                        color: 'red'
                    })
                })
        }
    }, [id, getProduct])

    const handleSubmit = async (productData: Product) => {
        if (!id) return

        setUpdating(true)
        try {
            await updateProduct(id, productData)
            notifications.show({
                title: 'Success',
                message: 'Product updated successfully',
                color: 'green'
            })
            navigate(`/products/${id}`)
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to update product',
                color: 'red'
            })
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
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
                    The product you are trying to edit could not be found.
                </Alert>
            </Stack>
        )
    }

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <Group>
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => navigate(`/products/${id}`)}
                    >
                        Back to Product
                    </Button>
                </Group>
            </Group>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="lg">
                    <Group justify="space-between" align="center">
                        <div>
                            <Title order={2}>Edit Product</Title>
                            <Group gap="xs" mt="xs">
                                <span style={{ fontSize: '0.875rem', color: 'var(--mantine-color-dimmed)' }}>
                                    Product ID: {product.id}
                                </span>
                                <span style={{ fontSize: '0.875rem', color: 'var(--mantine-color-dimmed)' }}>
                                    • {product.name}
                                </span>
                            </Group>
                        </div>
                    </Group>

                    <ProductForm
                        product={product}
                        onSubmit={handleSubmit}
                        loading={updating}
                        submitLabel="Update Product"
                    />
                </Stack>
            </Card>
        </Stack>
    )
}

export default EditProduct
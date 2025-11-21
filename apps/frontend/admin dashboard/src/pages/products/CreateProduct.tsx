import { useNavigate } from 'react-router-dom'
import { Stack, Title, Card, Button, Group } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useProducts } from '../../hooks/useProducts'
import ProductForm from './ProductForm'
import type { Product } from '../../types/products'

const CreateProduct = () => {
    const navigate = useNavigate()
    const { createProduct, loading } = useProducts()

    const handleSubmit = async (productData: Product) => {
        try {
            await createProduct(productData)
            notifications.show({
                title: 'Success',
                message: 'Product created successfully',
                color: 'green'
            })
            navigate('/products')
        } catch (error) {
            // Error notification is handled in the hook
            console.error('Error creating product:', error)
        }
    }

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

            <Title order={1}>Create New Product</Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <ProductForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    submitLabel="Create Product"
                />
            </Card>
        </Stack>
    )
}

export default CreateProduct
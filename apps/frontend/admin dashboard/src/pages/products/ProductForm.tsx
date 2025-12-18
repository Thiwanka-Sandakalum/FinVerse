import { useForm } from '@mantine/form'
import { useState, useEffect } from 'react'
import {
    Stack,
    TextInput,
    Select,
    Switch,
    Button,
    Group,
    LoadingOverlay,
    Alert,
    Modal
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useProductCategories } from '../../hooks/useProductCategories'
import { ProductsService } from '../../types/products/services/ProductsService'
import { OrganizationsService } from '../../types/user/services/OrganizationsService'
import type { Product } from '../../types/products'

interface ProductFormProps {
    product?: Product
    onSubmit: (product: Product) => Promise<void>
    loading?: boolean
    submitLabel?: string
}

const ProductForm = ({ product, onSubmit, loading = false, submitLabel = 'Save Product' }: ProductFormProps) => {
    const { categories, fetchCategories } = useProductCategories()
    const [categoryFields, setCategoryFields] = useState<any[]>([])
    const [loadingCategoryFields, setLoadingCategoryFields] = useState(false)
    // Removed customDetails state
    const [addFieldModalOpen, setAddFieldModalOpen] = useState(false)
    const [newField, setNewField] = useState({ name: '', dataType: 'string', isRequired: false })
    const [addingField, setAddingField] = useState(false)
    const [institutions, setInstitutions] = useState<{ value: string; label: string }[]>([])
    const [loadingInstitutions, setLoadingInstitutions] = useState(false)
    // Fetch institutions (organizations) on mount
    useEffect(() => {
        setLoadingInstitutions(true)
        OrganizationsService.getOrgs(0, 100)
            .then((res: any) => {
                const items = res && Array.isArray(res.items) ? res.items : []
                setInstitutions(
                    items.map((org: any) => ({
                        value: org.id,
                        label: org.display_name || org.name || org.metadata?.companyName || org.id
                    }))
                )
            })
            .catch(() => setInstitutions([]))
            .finally(() => setLoadingInstitutions(false))
    }, [])

    const form = useForm<Product>({
        initialValues: {
            name: product?.name || '',
            institutionId: product?.institutionId || '',
            categoryId: product?.categoryId || '',
            details: product?.details || {},
            isFeatured: product?.isFeatured || false,
            isActive: product?.isActive !== undefined ? product.isActive : true,
            ...product
        },
        validate: {
            name: (value) => (value ? null : 'Product name is required'),
            institutionId: (value) => (value ? null : 'Institution ID is required'),
            categoryId: (value) => (value ? null : 'Category is required')
        }
    })

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    // Load category fields when category changes
    useEffect(() => {
        if (form.values.categoryId) {
            setLoadingCategoryFields(true)
            ProductsService.getProductsCategoriesFields(form.values.categoryId)
                .then((fields: any) => setCategoryFields(Array.isArray(fields.data) ? fields.data : []))
                .catch(() => setCategoryFields([]))
                .finally(() => setLoadingCategoryFields(false))
        }
    }, [form.values.categoryId])

    const handleSubmit = async (values: Product) => {
        try {
            await onSubmit({ ...values })
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md" pos="relative">
                <LoadingOverlay visible={loading} />

                <TextInput
                    label="Product Name"
                    placeholder="Enter product name"
                    required
                    {...form.getInputProps('name')}
                />

                <Select
                    label="Institution"
                    placeholder={loadingInstitutions ? 'Loading institutions...' : 'Select an institution'}
                    required
                    data={institutions}
                    searchable
                    disabled={loadingInstitutions}
                    {...form.getInputProps('institutionId')}
                />

                <Select
                    label="Category"
                    placeholder="Select a category"
                    required
                    data={categories.map(cat => ({
                        value: cat.id || '',
                        label: cat.name || 'Unnamed Category'
                    }))}
                    {...form.getInputProps('categoryId')}
                />

                <Group grow>
                    <Switch
                        label="Featured Product"
                        description="Mark this product as featured"
                        {...form.getInputProps('isFeatured', { type: 'checkbox' })}
                    />

                    <Switch
                        label="Active"
                        description="Product is active and visible"
                        {...form.getInputProps('isActive', { type: 'checkbox' })}
                    />
                </Group>

                {loadingCategoryFields && (
                    <Alert icon={<IconInfoCircle size={16} />} color="blue">
                        Loading category-specific fields...
                    </Alert>
                )}

                {/* Product Description field (always shown) */}
                <TextInput
                    label="Product Description"
                    placeholder="Enter product description"
                    required
                    value={form.values.details.description || ''}
                    onChange={e =>
                        form.setFieldValue('details', {
                            ...form.values.details,
                            description: e.target.value
                        })
                    }
                />

                {/* Product Photo field (always shown) */}
                <TextInput
                    label="Product Photo URL"
                    placeholder="Enter product photo URL"
                    required
                    value={form.values.details.photo || ''}
                    onChange={e =>
                        form.setFieldValue('details', {
                            ...form.values.details,
                            photo: e.target.value
                        })
                    }
                />

                {categoryFields.length > 0 && (
                    <Stack gap="sm">
                        <div>Category-specific fields:</div>
                        {categoryFields.map((field) => (
                            <div key={field.id}>
                                {field.dataType === 'string' && (
                                    <TextInput
                                        label={field.name}
                                        required={field.isRequired}
                                        value={form.values.details[field.name] || ''}
                                        onChange={(e) =>
                                            form.setFieldValue('details', {
                                                ...form.values.details,
                                                [field.name]: e.target.value
                                            })
                                        }
                                    />
                                )}
                                {field.dataType === 'number' && (
                                    <TextInput
                                        type="number"
                                        label={field.name}
                                        required={field.isRequired}
                                        value={form.values.details[field.name] || ''}
                                        onChange={(e) =>
                                            form.setFieldValue('details', {
                                                ...form.values.details,
                                                [field.name]: parseFloat(e.target.value) || 0
                                            })
                                        }
                                    />
                                )}
                                {field.dataType === 'boolean' && (
                                    <Switch
                                        label={field.name}
                                        checked={form.values.details[field.name] || false}
                                        onChange={(e) =>
                                            form.setFieldValue('details', {
                                                ...form.values.details,
                                                [field.name]: e.currentTarget.checked
                                            })
                                        }
                                    />
                                )}
                            </div>
                        ))}
                        <Button size="xs" variant="outline" onClick={() => setAddFieldModalOpen(true)}>
                            Add New Field to Category
                        </Button>
                    </Stack>
                )}


                {/* Custom Details section removed */}

                <Group justify="flex-end">
                    <Button type="submit" loading={loading}>
                        {submitLabel}
                    </Button>
                </Group>
            </Stack>

            <Modal opened={addFieldModalOpen} onClose={() => setAddFieldModalOpen(false)} title="Add New Field to Category" >
                <Stack gap="sm">
                    <TextInput
                        label="Field Name"
                        value={newField.name}
                        onChange={e => setNewField(f => ({ ...f, name: e.target.value }))}
                    />
                    <Select
                        label="Data Type"
                        data={['string', 'number', 'boolean']}
                        value={newField.dataType}
                        onChange={v => setNewField(f => ({ ...f, dataType: v || 'string' }))}
                    />
                    <Switch
                        label="Required"
                        checked={newField.isRequired}
                        onChange={e => setNewField(f => ({ ...f, isRequired: e.currentTarget.checked }))}
                    />
                    <Group justify="flex-end">
                        <Button loading={addingField} onClick={async () => {
                            if (!form.values.categoryId || !newField.name) return
                            setAddingField(true)
                            try {
                                await ProductsService.postProductsCategoriesFields(form.values.categoryId, {
                                    name: newField.name,
                                    dataType: newField.dataType as any,
                                    isRequired: newField.isRequired
                                })
                                setAddFieldModalOpen(false)
                                setNewField({ name: '', dataType: 'string', isRequired: false })
                                await ProductsService.getProductsCategoriesFields(form.values.categoryId).then(setCategoryFields)
                            } catch (e) {
                                // handle error
                            } finally {
                                setAddingField(false)
                            }
                        }}>
                            Add Field
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </form>
    )
}

export default ProductForm
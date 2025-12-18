import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { ProductsService, type ProductCategory, type FieldDefinition } from '../types/products'

interface UseProductCategoriesState {
    categories: ProductCategory[]
    loading: boolean
    error: string | null
}

interface UseProductCategoriesFilters {
    parentId?: string
    level?: number
    includeChildren?: boolean
    page?: number
    limit?: number
    sort?: 'name' | 'level'
    order?: 'asc' | 'desc'
}

export const useProductCategories = () => {
    const [state, setState] = useState<UseProductCategoriesState>({
        categories: [],
        loading: false,
        error: null
    })

    const fetchCategories = useCallback(async (filters: UseProductCategoriesFilters = {}) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const categories: any = await ProductsService.getProductsCategories(
                filters.parentId,
                filters.level,
                filters.includeChildren || false,
                filters.page || 1,
                filters.limit || 20,
                filters.sort || 'level',
                filters.order || 'asc'
            )

            setState(prev => ({
                ...prev,
                categories: categories.data,
                loading: false
            }))

            return categories
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch categories'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const getCategoryHierarchy = useCallback(async (): Promise<ProductCategory[]> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const hierarchy = await ProductsService.getProductsCategoriesHierarchy()
            setState(prev => ({ ...prev, loading: false }))
            return hierarchy
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch category hierarchy'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const getCategory = useCallback(async (id: string): Promise<ProductCategory> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const category = await ProductsService.getProductsCategories1(id)
            setState(prev => ({ ...prev, loading: false }))
            return category
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch category'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const createCategory = useCallback(async (categoryData: ProductCategory): Promise<ProductCategory> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const newCategory = await ProductsService.postProductsCategories(categoryData)

            setState(prev => ({
                ...prev,
                categories: [...prev.categories, newCategory],
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Category created successfully',
                color: 'green'
            })

            return newCategory
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to create category'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const updateCategory = useCallback(async (id: string, categoryData: ProductCategory): Promise<ProductCategory> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const updatedCategory = await ProductsService.putProductsCategories(id, categoryData)

            setState(prev => ({
                ...prev,
                categories: prev.categories.map(category =>
                    category.id === id ? updatedCategory : category
                ),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Category updated successfully',
                color: 'green'
            })

            return updatedCategory
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to update category'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const deleteCategory = useCallback(async (id: string): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            await ProductsService.deleteProductsCategories(id)

            setState(prev => ({
                ...prev,
                categories: prev.categories.filter(category => category.id !== id),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Category deleted successfully',
                color: 'green'
            })
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to delete category'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const getCategoryFields = useCallback(async (categoryId: string): Promise<FieldDefinition[]> => {
        try {
            const fields = await ProductsService.getProductsCategoriesFields(categoryId)
            return fields
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch category fields'
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const addCategoryField = useCallback(async (
        categoryId: string,
        fieldData: {
            name: string
            dataType: 'string' | 'number' | 'date' | 'boolean' | 'json'
            isRequired?: boolean
            validation?: Record<string, any>
        }
    ): Promise<FieldDefinition> => {
        try {
            const newField = await ProductsService.postProductsCategoriesFields(categoryId, fieldData)

            notifications.show({
                title: 'Success',
                message: 'Field added successfully',
                color: 'green'
            })

            return newField
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to add field'
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const updateCategoryField = useCallback(async (
        categoryId: string,
        fieldId: string,
        fieldData: {
            name?: string
            dataType?: 'string' | 'number' | 'date' | 'boolean' | 'json'
            isRequired?: boolean
            validation?: Record<string, any>
        }
    ): Promise<FieldDefinition> => {
        try {
            const updatedField = await ProductsService.putProductsCategoriesFields(categoryId, fieldId, fieldData)

            notifications.show({
                title: 'Success',
                message: 'Field updated successfully',
                color: 'green'
            })

            return updatedField
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to update field'
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const deleteCategoryField = useCallback(async (categoryId: string, fieldId: string): Promise<void> => {
        try {
            await ProductsService.deleteProductsCategoriesFields(categoryId, fieldId)

            notifications.show({
                title: 'Success',
                message: 'Field deleted successfully',
                color: 'green'
            })
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to delete field'
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    return {
        ...state,
        fetchCategories,
        getCategoryHierarchy,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategoryFields,
        addCategoryField,
        updateCategoryField,
        deleteCategoryField,
        refetch: fetchCategories
    }
}
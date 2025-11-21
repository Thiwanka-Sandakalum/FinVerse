import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { ProductsService, type Product, type PaginatedResponse } from '../types/products'

interface UseProductsState {
    products: Product[]
    loading: boolean
    error: string | null
    total: number
    limit: number
    offset: number
}

interface UseProductsFilters {
    categoryId?: string
    institutionId?: string
    isActive?: boolean
    isFeatured?: boolean
    search?: string
    page?: number
    limit?: number
    sort?: 'name' | 'createdAt' | 'updatedAt'
    order?: 'asc' | 'desc'
}

export const useProducts = () => {
    const [state, setState] = useState<UseProductsState>({
        products: [],
        loading: false,
        error: null,
        total: 0,
        limit: 20,
        offset: 0
    })

    const fetchProducts = useCallback(async (filters: UseProductsFilters = {}) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const response = await ProductsService.getProducts(
                filters.categoryId,
                filters.institutionId,
                filters.isActive,
                filters.isFeatured,
                undefined, // productIds
                filters.page || 1,
                filters.limit || 20,
                filters.sort || 'createdAt',
                filters.order || 'desc',
                filters.search
            )

            setState(prev => ({
                ...prev,
                products: response.data as Product[] || [],
                total: response.meta?.total || 0,
                limit: response.meta?.limit || 20,
                offset: response.meta?.offset || 0,
                loading: false
            }))

            return response
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch products'
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

    const getProduct = useCallback(async (id: string): Promise<Product> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const product = await ProductsService.getProducts1(id)
            setState(prev => ({ ...prev, loading: false }))
            return product
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch product'
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

    const createProduct = useCallback(async (productData: Product): Promise<Product> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const newProduct = await ProductsService.postProducts(productData)

            setState(prev => ({
                ...prev,
                products: [newProduct, ...prev.products],
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Product created successfully',
                color: 'green'
            })

            return newProduct
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to create product'
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

    const updateProduct = useCallback(async (id: string, productData: Product): Promise<Product> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const updatedProduct = await ProductsService.putProducts(id, productData)

            setState(prev => ({
                ...prev,
                products: prev.products.map(product =>
                    product.id === id ? updatedProduct : product
                ),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Product updated successfully',
                color: 'green'
            })

            return updatedProduct
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to update product'
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

    const deleteProduct = useCallback(async (id: string): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            await ProductsService.deleteProducts(id)

            setState(prev => ({
                ...prev,
                products: prev.products.filter(product => product.id !== id),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Product deleted successfully',
                color: 'green'
            })
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to delete product'
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

    const toggleSaveProduct = useCallback(async (productId: string): Promise<boolean> => {
        try {
            const response = await ProductsService.putProductsSave(productId)

            notifications.show({
                title: 'Success',
                message: response.message,
                color: 'green'
            })

            return response.isSaved
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to toggle save product'
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const getSavedProducts = useCallback(async (page = 1, limit = 20) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const response = await ProductsService.getProductsSaved(page, limit)

            setState(prev => ({
                ...prev,
                products: response.data as Product[] || [],
                total: response.meta?.total || 0,
                limit: response.meta?.limit || 20,
                offset: response.meta?.offset || 0,
                loading: false
            }))

            return response
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch saved products'
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

    return {
        ...state,
        fetchProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleSaveProduct,
        getSavedProducts,
        refetch: fetchProducts
    }
}
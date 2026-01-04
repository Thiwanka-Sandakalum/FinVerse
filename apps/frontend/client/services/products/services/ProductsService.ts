/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldDefinition } from '../models/FieldDefinition';
import type { MessageResponse } from '../models/MessageResponse';
import type { PaginatedResponse } from '../models/PaginatedResponse';
import type { Product } from '../models/Product';
import type { ProductCategory } from '../models/ProductCategory';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductsService {
    /**
     * Get All Products
     * Retrieve a list of all products (can be filtered by categories, types, etc.)
     * @param categoryId Filter by category ID
     * @param institutionId Filter by institution ID
     * @param isActive Filter by active status
     * @param isFeatured Filter by featured status
     * @param productIds Comma-separated list of product IDs to filter
     * @param page Page number for pagination
     * @param limit Number of items per page
     * @param sort Field to sort by
     * @param order Sort order (ascending or descending)
     * @param search Search term for product name
     * @returns PaginatedResponse A list of products
     * @throws ApiError
     */
    public static getProducts(
        categoryId?: string,
        institutionId?: string,
        isActive?: boolean,
        isFeatured?: boolean,
        productIds?: Array<string>,
        page: number = 1,
        limit: number = 20,
        sort: 'name' | 'createdAt' | 'updatedAt' = 'createdAt',
        order: 'asc' | 'desc' = 'desc',
        search?: string,
    ): CancelablePromise<PaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products',
            query: {
                'categoryId': categoryId,
                'institutionId': institutionId,
                'isActive': isActive,
                'isFeatured': isFeatured,
                'productIds': productIds,
                'page': page,
                'limit': limit,
                'sort': sort,
                'order': order,
                'search': search,
            },
            errors: {
                400: `Bad request`,
            },
        });
    }
    /**
     * Create Product
     * Create a new financial product
     * @param requestBody
     * @returns Product Product created successfully
     * @throws ApiError
     */
    public static postProducts(
        requestBody?: Product,
    ): CancelablePromise<Product> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden - User is not an Institution Admin`,
            },
        });
    }
    /**
     * Get Product Details
     * Retrieve detailed information about a specific product
     * @param id
     * @returns Product Product details
     * @throws ApiError
     */
    public static getProducts1(
        id: string,
    ): CancelablePromise<Product> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Product not found`,
            },
        });
    }
    /**
     * Edit Product
     * Edit an existing product
     * @param id
     * @param requestBody
     * @returns Product Product updated successfully
     * @throws ApiError
     */
    public static putProducts(
        id: string,
        requestBody: Product,
    ): CancelablePromise<Product> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/products/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden - User is not an Institution Admin`,
                404: `Product not found`,
            },
        });
    }
    /**
     * Delete Product
     * Delete a specific product from the platform
     * @param id
     * @returns MessageResponse Product deleted successfully
     * @throws ApiError
     */
    public static deleteProducts(
        id: string,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/products/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - User is not an Institution Admin`,
                404: `Product not found`,
            },
        });
    }
    /**
     * Get All Product Categories
     * Retrieve a list of all product categories
     * @param filterParentId
     * @param filterLevel
     * @param includeChildren
     * @param page
     * @param limit
     * @param sort
     * @param order
     * @returns ProductCategory A list of product categories
     * @throws ApiError
     */
    public static getProductsCategories(
        filterParentId?: string,
        filterLevel?: number,
        includeChildren: boolean = false,
        page: number = 1,
        limit: number = 20,
        sort: 'name' | 'level' = 'level',
        order: 'asc' | 'desc' = 'asc',
    ): CancelablePromise<Array<ProductCategory>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/categories',
            query: {
                'filter[parentId]': filterParentId,
                'filter[level]': filterLevel,
                'includeChildren': includeChildren,
                'page': page,
                'limit': limit,
                'sort': sort,
                'order': order,
            },
        });
    }
    /**
     * Create Product Category
     * Create a new product category
     * @param requestBody
     * @returns ProductCategory Product category created successfully
     * @throws ApiError
     */
    public static postProductsCategories(
        requestBody: ProductCategory,
    ): CancelablePromise<ProductCategory> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden - User is not a System Admin`,
            },
        });
    }
    /**
     * Get Product Category by ID
     * Retrieve a product category by its ID
     * @param id
     * @returns ProductCategory Product category details
     * @throws ApiError
     */
    public static getProductsCategories1(
        id: string,
    ): CancelablePromise<ProductCategory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/categories/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Product category not found`,
            },
        });
    }
    /**
     * Update Product Category
     * Update an existing product category
     * @param id
     * @param requestBody
     * @returns ProductCategory Product category updated successfully
     * @throws ApiError
     */
    public static putProductsCategories(
        id: string,
        requestBody?: ProductCategory,
    ): CancelablePromise<ProductCategory> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/products/categories/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden - User is not a System Admin`,
                404: `Product category not found`,
            },
        });
    }
    /**
     * Delete Product Category
     * Delete a product category by its ID
     * @param id
     * @returns MessageResponse Product category deleted successfully
     * @throws ApiError
     */
    public static deleteProductsCategories(
        id: string,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/products/categories/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - User is not a System Admin`,
                404: `Product category not found`,
            },
        });
    }
    /**
     * Get Product Category Hierarchy
     * Retrieve the full hierarchy of product categories
     * @returns ProductCategory Product category hierarchy
     * @throws ApiError
     */
    public static getProductsCategoriesHierarchy(): CancelablePromise<Array<ProductCategory>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/categories/hierarchy',
        });
    }
    /**
     * Get Field Definitions for Category
     * Retrieve all field definitions for a product category
     * @param categoryId
     * @returns FieldDefinition List of field definitions
     * @throws ApiError
     */
    public static getProductsCategoriesFields(
        categoryId: string,
    ): CancelablePromise<Array<FieldDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/categories/{categoryId}/fields',
            path: {
                'categoryId': categoryId,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
    /**
     * Add Field Definition to Category
     * Create a new field definition for a product category
     * @param categoryId
     * @param requestBody
     * @returns FieldDefinition Field definition created successfully
     * @throws ApiError
     */
    public static postProductsCategoriesFields(
        categoryId: string,
        requestBody: {
            name: string;
            dataType: 'string' | 'number' | 'date' | 'boolean' | 'json';
            isRequired?: boolean;
            validation?: Record<string, any>;
        },
    ): CancelablePromise<FieldDefinition> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/categories/{categoryId}/fields',
            path: {
                'categoryId': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                404: `Category not found`,
            },
        });
    }
    /**
     * Get Field Definition
     * Retrieve a specific field definition
     * @param categoryId
     * @param fieldId
     * @returns FieldDefinition Field definition details
     * @throws ApiError
     */
    public static getProductsCategoriesFields1(
        categoryId: string,
        fieldId: string,
    ): CancelablePromise<FieldDefinition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/categories/{categoryId}/fields/{fieldId}',
            path: {
                'categoryId': categoryId,
                'fieldId': fieldId,
            },
            errors: {
                404: `Field definition not found`,
            },
        });
    }
    /**
     * Update Field Definition
     * Update a field definition
     * @param categoryId
     * @param fieldId
     * @param requestBody
     * @returns FieldDefinition Field definition updated successfully
     * @throws ApiError
     */
    public static putProductsCategoriesFields(
        categoryId: string,
        fieldId: string,
        requestBody: {
            name?: string;
            dataType?: 'string' | 'number' | 'date' | 'boolean' | 'json';
            isRequired?: boolean;
            validation?: Record<string, any>;
        },
    ): CancelablePromise<FieldDefinition> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/products/categories/{categoryId}/fields/{fieldId}',
            path: {
                'categoryId': categoryId,
                'fieldId': fieldId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden - User is not a System Admin`,
                404: `Field definition not found`,
            },
        });
    }
    /**
     * Delete Field Definition
     * Delete a field definition
     * @param categoryId
     * @param fieldId
     * @returns MessageResponse Field definition deleted successfully
     * @throws ApiError
     */
    public static deleteProductsCategoriesFields(
        categoryId: string,
        fieldId: string,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/products/categories/{categoryId}/fields/{fieldId}',
            path: {
                'categoryId': categoryId,
                'fieldId': fieldId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - User is not a System Admin`,
                404: `Field definition not found`,
            },
        });
    }
    /**
     * Get User's Saved Products
     * Retrieve all products saved by the authenticated user
     * @param page Page number for pagination
     * @param limit Number of items per page
     * @returns PaginatedResponse List of saved products
     * @throws ApiError
     */
    public static getProductsSaved(
        page: number = 1,
        limit: number = 20,
    ): CancelablePromise<PaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/saved',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Save Product
     * Save a product to user's saved list
     * @param productId ID of the product to save/unsave
     * @returns any Product saved successfully
     * @throws ApiError
     */
    public static postProductsSave(
        productId: string,
    ): CancelablePromise<{
        message: string;
        isSaved: boolean;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{productId}/save',
            path: {
                'productId': productId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Product not found`,
                409: `Product already saved`,
            },
        });
    }
    /**
     * Toggle Save Product
     * Toggle save status of a product (save if not saved, unsave if saved)
     * @param productId ID of the product to save/unsave
     * @returns any Product save status toggled successfully
     * @throws ApiError
     */
    public static putProductsSave(
        productId: string,
    ): CancelablePromise<{
        message: string;
        action: 'saved' | 'unsaved';
        isSaved: boolean;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/products/{productId}/save',
            path: {
                'productId': productId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Product not found`,
            },
        });
    }
    /**
     * Unsave Product
     * Remove a product from user's saved list
     * @param productId ID of the product to save/unsave
     * @returns any Product unsaved successfully
     * @throws ApiError
     */
    public static deleteProductsSave(
        productId: string,
    ): CancelablePromise<{
        message: string;
        isSaved: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/products/{productId}/save',
            path: {
                'productId': productId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Product not saved by user`,
            },
        });
    }
    /**
     * Check Product Save Status
     * Check if a product is saved by the authenticated user
     * @param productId ID of the product to check save status
     * @returns any Product save status
     * @throws ApiError
     */
    public static getProductsSaveStatus(
        productId: string,
    ): CancelablePromise<{
        productId: string;
        isSaved: boolean;
        savedAt?: string | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{productId}/save-status',
            path: {
                'productId': productId,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}

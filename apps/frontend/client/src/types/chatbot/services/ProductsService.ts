/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Product } from '../models/Product';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductsService {
    /**
     * Get product by ID
     * Retrieve detailed information about a specific financial product
     * @param productId Unique identifier for the financial product
     * @returns Product Product details
     * @throws ApiError
     */
    public static getProducts(
        productId: string,
    ): CancelablePromise<Product> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{product_id}',
            path: {
                'product_id': productId,
            },
            errors: {
                404: `Product not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get products by type
     * Retrieve all products of a specific type (e.g., savings, credit_cards, loans)
     * @param typeName Type of financial product
     * @returns Product List of products of the specified type
     * @throws ApiError
     */
    public static getProductsType(
        typeName: string,
    ): CancelablePromise<Array<Product>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/type/{type_name}',
            path: {
                'type_name': typeName,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }
}

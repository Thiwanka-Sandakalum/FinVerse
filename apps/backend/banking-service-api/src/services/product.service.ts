import { ProductRepository } from '../repositories/product.repository';
import { ApiError } from '../middlewares/error.middleware';
import { ProductCreateDto, ProductUpdateDto } from '../types/api.types';

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    /**
     * Get all products with filtering
     */
    async getAllProducts(filters: {
        categoryId?: string;
        institutionId?: string;
        productTypeId?: string;
        isActive?: boolean;
        isFeatured?: boolean;
        limit?: number;
        offset?: number;
        search?: string;
    }, userId?: string, userInstitutionId?: string) {
        // If user has institutionId and no explicit institutionId filter is provided,
        // filter by user's institution
        if (userInstitutionId && !filters.institutionId) {
            filters.institutionId = userInstitutionId;
        }

        return this.productRepository.findAll(filters, userId);
    }

    /**
     * Get a product by ID
     */
    async getProductById(id: string, userId?: string, userInstitutionId?: string) {
        const product = await this.productRepository.findById(id, userId);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // If user has institutionId, check if product belongs to their institution
        if (userInstitutionId && product.institutionId !== userInstitutionId) {
            throw new ApiError(403, 'Access denied: Product does not belong to your institution');
        }

        return product;
    }

    /**
     * Create a new product
     */
    async createProduct(data: ProductCreateDto, userInstitutionId?: string) {
        // If user has institutionId, ensure product is created for their institution
        if (userInstitutionId && data.institutionId !== userInstitutionId) {
            throw new ApiError(403, 'Access denied: Cannot create product for different institution');
        }

        return this.productRepository.create(data);
    }

    /**
     * Update a product
     */
    async updateProduct(id: string, data: ProductUpdateDto, userInstitutionId?: string) {
        // First check if product exists and user has access
        const productExists = await this.productRepository.findById(id);

        if (!productExists) {
            throw new ApiError(404, 'Product not found');
        }

        // If user has institutionId, check if product belongs to their institution
        if (userInstitutionId && productExists.institutionId !== userInstitutionId) {
            throw new ApiError(403, 'Access denied: Product does not belong to your institution');
        }

        return this.productRepository.update(id, data);
    }

    /**
     * Delete a product
     */
    async deleteProduct(id: string, userInstitutionId?: string) {
        // First check if product exists and user has access
        const productExists = await this.productRepository.findById(id);

        if (!productExists) {
            throw new ApiError(404, 'Product not found');
        }

        // If user has institutionId, check if product belongs to their institution
        if (userInstitutionId && productExists.institutionId !== userInstitutionId) {
            throw new ApiError(403, 'Access denied: Product does not belong to your institution');
        }

        return this.productRepository.delete(id);
    }

    /**
     * Activate or deactivate a product
     */
    async setProductActiveStatus(id: string, isActive: boolean, userInstitutionId?: string) {
        // First check if product exists and user has access
        const productExists = await this.productRepository.findById(id);

        if (!productExists) {
            throw new ApiError(404, 'Product not found');
        }

        // If user has institutionId, check if product belongs to their institution
        if (userInstitutionId && productExists.institutionId !== userInstitutionId) {
            throw new ApiError(403, 'Access denied: Product does not belong to your institution');
        }

        return this.productRepository.setActiveStatus(id, isActive);
    }

    /**
     * Get distinct fields and their data types from product details by product type
     */
    async getProductFieldsByType(productTypeId: string) {
        // First verify the product type exists
        const productTypeExists = await this.productRepository.findProductTypeById(productTypeId);

        if (!productTypeExists) {
            throw new ApiError(404, 'Product type not found');
        }

        const fields = await this.productRepository.getProductFieldsByType(productTypeId);

        return {
            productType: productTypeExists,
            fields: fields
        };
    }
}

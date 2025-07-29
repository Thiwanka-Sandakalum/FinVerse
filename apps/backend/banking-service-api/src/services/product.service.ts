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
        minRate?: number;
        maxRate?: number;
        limit?: number;
        offset?: number;
    }) {
        return this.productRepository.findAll(filters);
    }

    /**
     * Get a product by ID
     */
    async getProductById(id: string) {
        const product = await this.productRepository.findById(id);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        return product;
    }

    /**
     * Create a new product
     */
    async createProduct(data: ProductCreateDto) {
        // Additional business logic can be added here
        // For example, checking if the institution and product type exist

        return this.productRepository.create(data);
    }

    /**
     * Update a product
     */
    async updateProduct(id: string, data: ProductUpdateDto) {
        // First check if product exists
        const productExists = await this.productRepository.findById(id);

        if (!productExists) {
            throw new ApiError(404, 'Product not found');
        }

        return this.productRepository.update(id, data);
    }

    /**
     * Delete a product
     */
    async deleteProduct(id: string) {
        // First check if product exists
        const productExists = await this.productRepository.findById(id);

        if (!productExists) {
            throw new ApiError(404, 'Product not found');
        }

        return this.productRepository.delete(id);
    }

    /**
     * Activate or deactivate a product
     */
    async setProductActiveStatus(id: string, isActive: boolean) {
        // First check if product exists
        const productExists = await this.productRepository.findById(id);

        if (!productExists) {
            throw new ApiError(404, 'Product not found');
        }

        return this.productRepository.setActiveStatus(id, isActive);
    }
}

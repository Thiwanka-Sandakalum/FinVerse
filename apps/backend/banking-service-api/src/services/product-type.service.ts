import { ProductTypeRepository, ProductTypeCreateDto, ProductTypeUpdateDto } from '../repositories/product-type.repository';
import { ProductCategoryRepository } from '../repositories/product-category.repository';

export class ProductTypeService {
    private productTypeRepository: ProductTypeRepository;
    private productCategoryRepository: ProductCategoryRepository;

    constructor() {
        this.productTypeRepository = new ProductTypeRepository();
        this.productCategoryRepository = new ProductCategoryRepository();
    }

    /**
     * Get all product types with optional filtering
     */
    async getAllProductTypes(filters: {
        categoryId?: string;
    } = {}) {
        return this.productTypeRepository.findAll(filters);
    }

    /**
     * Get product type by ID
     */
    async getProductTypeById(id: string) {
        const productType = await this.productTypeRepository.findById(id);

        if (!productType) {
            throw new Error(`Product type with ID ${id} not found`);
        }

        return productType;
    }

    /**
     * Create a new product type
     */
    async createProductType(data: ProductTypeCreateDto) {
        // Verify category exists
        const categoryExists = await this.productCategoryRepository.findById(data.categoryId);
        if (!categoryExists) {
            throw new Error(`Product category with ID ${data.categoryId} not found`);
        }

        // Check if code already exists
        const codeExists = await this.productTypeRepository.findByCode(data.code);
        if (codeExists) {
            throw new Error(`Product type with code ${data.code} already exists`);
        }

        return this.productTypeRepository.create(data);
    }

    /**
     * Update a product type
     */
    async updateProductType(id: string, data: ProductTypeUpdateDto) {
        // Check if product type exists
        const productType = await this.productTypeRepository.findById(id);
        if (!productType) {
            throw new Error(`Product type with ID ${id} not found`);
        }

        // Verify category exists if it's being updated
        if (data.categoryId) {
            const categoryExists = await this.productCategoryRepository.findById(data.categoryId);
            if (!categoryExists) {
                throw new Error(`Product category with ID ${data.categoryId} not found`);
            }
        }

        return this.productTypeRepository.update(id, data);
    }

    /**
     * Delete a product type
     */
    async deleteProductType(id: string) {
        // Check if product type exists
        const productType = await this.productTypeRepository.findById(id);
        if (!productType) {
            throw new Error(`Product type with ID ${id} not found`);
        }

        // Check if there are any products using this type
        if (productType.products && productType.products.length > 0) {
            throw new Error(`Cannot delete product type with ID ${id} as it is being used by ${productType.products.length} products`);
        }

        return this.productTypeRepository.delete(id);
    }
}

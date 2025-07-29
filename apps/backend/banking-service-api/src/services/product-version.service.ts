import { ProductVersionRepository, ProductVersionCreateDto } from '../repositories/product-version.repository';
import { ProductRepository } from '../repositories/product.repository';

export class ProductVersionService {
    private productVersionRepository: ProductVersionRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.productVersionRepository = new ProductVersionRepository();
        this.productRepository = new ProductRepository();
    }

    /**
     * Get version history for a product
     */
    async getVersionHistory(productId: string, options: {
        limit?: number;
    } = {}) {
        // Check if product exists
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        return this.productVersionRepository.findByProductId(productId, options);
    }

    /**
     * Get a specific version of a product
     */
    async getProductVersion(productId: string, versionNumber: number) {
        // Check if product exists
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const version = await this.productVersionRepository.findByVersionNumber(productId, versionNumber);
        if (!version) {
            throw new Error(`Version ${versionNumber} for product with ID ${productId} not found`);
        }

        return version;
    }

    /**
     * Get latest version of a product
     */
    async getLatestVersion(productId: string) {
        // Check if product exists
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const version = await this.productVersionRepository.getLatestVersion(productId);
        if (!version) {
            throw new Error(`No versions found for product with ID ${productId}`);
        }

        return version;
    }

    /**
     * Create a new product version (typically called internally by other services)
     */
    async createVersion(data: ProductVersionCreateDto) {
        // Check if product exists
        const productExists = await this.productRepository.findById(data.productId);
        if (!productExists) {
            throw new Error(`Product with ID ${data.productId} not found`);
        }

        return this.productVersionRepository.create(data);
    }
}

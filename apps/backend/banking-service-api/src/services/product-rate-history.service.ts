import { ProductRateHistoryRepository, ProductRateHistoryCreateDto } from '../repositories/product-rate-history.repository';
import { ProductRepository } from '../repositories/product.repository';

export class ProductRateHistoryService {
    private productRateHistoryRepository: ProductRateHistoryRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.productRateHistoryRepository = new ProductRateHistoryRepository();
        this.productRepository = new ProductRepository();
    }

    /**
     * Get rate history for a product
     */
    async getRateHistory(productId: string, options: {
        metric?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    } = {}) {
        // Check if product exists
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        return this.productRateHistoryRepository.findByProductId(productId, options);
    }

    /**
     * Get latest rate for a product by metric
     */
    async getLatestRate(productId: string, metric: string) {
        // Check if product exists
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        return this.productRateHistoryRepository.getLatestRate(productId, metric);
    }

    /**
     * Add a new rate history entry
     */
    async addRateHistoryEntry(data: ProductRateHistoryCreateDto) {
        // Check if product exists
        const productExists = await this.productRepository.findById(data.productId);
        if (!productExists) {
            throw new Error(`Product with ID ${data.productId} not found`);
        }

        // Validate rate value
        if (isNaN(Number(data.value))) {
            throw new Error('Rate value must be a number');
        }

        return this.productRateHistoryRepository.create(data);
    }

    /**
     * Delete all rate history for a product
     */
    async deleteRateHistory(productId: string) {
        // Check if product exists
        const productExists = await this.productRepository.findById(productId);
        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        return this.productRateHistoryRepository.deleteByProductId(productId);
    }
}

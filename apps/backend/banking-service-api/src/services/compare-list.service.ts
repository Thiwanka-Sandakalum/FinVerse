import { CompareListRepository } from '../repositories/compare-list.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ApiError } from '../middlewares/error.middleware';

export class CompareListService {
    private compareListRepository: CompareListRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.compareListRepository = new CompareListRepository();
        this.productRepository = new ProductRepository();
    }

    /**
     * Get all compare lists for a user
     */
    async getAllCompareLists(clerkUserId: string) {
        return this.compareListRepository.findAllByUser(clerkUserId);
    }

    /**
     * Get a compare list by ID for a user
     */
    async getCompareList(id: string, clerkUserId: string) {
        return this.compareListRepository.findByIdAndUser(id, clerkUserId);
    }
    /**
     * Create a compare list for a user
     */
    async createCompareList(clerkUserId: string, productIds: string[]) {
        // Check if all products exist
        for (const productId of productIds) {
            const product = await this.productRepository.findById(productId);

            if (!product) {
                throw new ApiError(404, `Product with ID ${productId} not found`);
            }
        }

        // Create compare list
        return this.compareListRepository.create(clerkUserId, productIds);
    }

    /**
     * Delete a compare list
     */
    async deleteCompareList(id: string, clerkUserId: string) {
        // Check if compare list exists and belongs to user
        const compareList = await this.compareListRepository.findByIdAndUser(id, clerkUserId);

        if (!compareList) {
            throw new ApiError(404, 'Compare list not found');
        }

        // Delete the compare list
        return this.compareListRepository.delete(id);
    }
}

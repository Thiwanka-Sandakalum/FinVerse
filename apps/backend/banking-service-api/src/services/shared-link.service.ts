import { SharedLinkRepository } from '../repositories/shared-link.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ApiError } from '../middlewares/error.middleware';

export class SharedLinkService {
    private sharedLinkRepository: SharedLinkRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.sharedLinkRepository = new SharedLinkRepository();
        this.productRepository = new ProductRepository();
    }

    /**
     * Get all shared links for a user
     */
    async getAllSharedLinks(clerkUserId: string) {
        return this.sharedLinkRepository.findAllByUser(clerkUserId);
    }

    /**
     * Share a product
     */
    async shareProduct(clerkUserId: string | null, productId: string, channel: string) {
        // Check if product exists
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Create shared link
        return this.sharedLinkRepository.create(clerkUserId, productId, channel);
    }
}

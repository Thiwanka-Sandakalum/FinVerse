import { ReviewRepository } from '../repositories/review.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ApiError } from '../middlewares/error.middleware';

export class ReviewService {
    private reviewRepository: ReviewRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.reviewRepository = new ReviewRepository();
        this.productRepository = new ProductRepository();
    }

    /**
     * Get all reviews for a product
     */
    async getProductReviews(productId: string) {
        // Check if product exists
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        return this.reviewRepository.findAllByProduct(productId);
    }

    /**
     * Get all reviews by a user
     */
    async getUserReviews(clerkUserId: string) {
        return this.reviewRepository.findAllByUser(clerkUserId);
    }

    /**
     * Create a review
     */
    async createReview(clerkUserId: string, productId: string, rating: number, comment?: string) {
        // Check if product exists
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Check if user has already reviewed this product
        const existingReview = await this.reviewRepository.findByProductAndUser(productId, clerkUserId);

        if (existingReview) {
            throw new ApiError(400, 'You have already reviewed this product');
        }

        // Create review
        return this.reviewRepository.create(clerkUserId, productId, rating, comment);
    }

    /**
     * Update a review
     */
    async updateReview(id: string, clerkUserId: string, rating: number, comment?: string) {
        // Check if review exists and belongs to user
        const review = await this.reviewRepository.findByIdAndUser(id, clerkUserId);

        if (!review) {
            throw new ApiError(404, 'Review not found');
        }

        // Update review
        return this.reviewRepository.update(id, rating, comment);
    }

    /**
     * Delete a review
     */
    async deleteReview(id: string, clerkUserId: string) {
        // Check if review exists and belongs to user
        const review = await this.reviewRepository.findByIdAndUser(id, clerkUserId);

        if (!review) {
            throw new ApiError(404, 'Review not found');
        }

        // Delete review
        return this.reviewRepository.delete(id);
    }
}

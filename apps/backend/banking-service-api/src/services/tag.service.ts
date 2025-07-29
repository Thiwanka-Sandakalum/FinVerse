import { TagRepository } from '../repositories/tag.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ApiError } from '../middlewares/error.middleware';

export class TagService {
    private tagRepository: TagRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.tagRepository = new TagRepository();
        this.productRepository = new ProductRepository();
    }

    /**
     * Get all product tags
     */
    async getAllTags() {
        return this.tagRepository.findAll();
    }

    /**
     * Add a tag to a product
     */
    async addTagToProduct(productId: string, tagId: string) {
        // Check if product exists
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Check if tag exists and add it to the product
        const tag = await this.tagRepository.addTagToProduct(productId, tagId);

        if (!tag) {
            throw new ApiError(404, 'Tag not found');
        }

        return tag;
    }

    /**
     * Remove a tag from a product
     */
    async removeTagFromProduct(productId: string, tagId: string) {
        // Check if product exists
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Check if tag exists
        const tag = await this.tagRepository.findById(tagId);

        if (!tag) {
            throw new ApiError(404, 'Tag not found');
        }

        // Remove the tag from the product
        try {
            await this.tagRepository.removeTagFromProduct(productId, tagId);

            return { success: true };
        } catch (error) {
            // Handle case where the tag is not associated with the product
            throw new ApiError(404, 'Tag is not associated with this product');
        }
    }

    /**
     * Get all tags for a product
     */
    async getProductTags(productId: string) {
        // Check if product exists
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        return this.tagRepository.findByProduct(productId);
    }
}

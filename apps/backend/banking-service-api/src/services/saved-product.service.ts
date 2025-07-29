import { SavedProductRepository } from '../repositories/saved-product.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ApiError } from '../middlewares/error.middleware';

export class SavedProductService {
    private savedProductRepository: SavedProductRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.savedProductRepository = new SavedProductRepository();
        this.productRepository = new ProductRepository();
    }

    /**
     * Get all saved products for a user
     */
    async getAllSavedProducts(clerkUserId: string) {
        return this.savedProductRepository.findAllByUser(clerkUserId);
    }

    /**
     * Save a product for a user
     */
    async saveProduct(clerkUserId: string, productId: string) {
        // Check if product exists
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Check if already saved
        const existingSaved = await this.savedProductRepository.findByProductAndUser(productId, clerkUserId);

        if (existingSaved) {
            throw new ApiError(400, 'Product already saved');
        }

        // Save the product
        return this.savedProductRepository.create(clerkUserId, productId);
    }

    /**
     * Delete a saved product
     */
    async deleteSavedProduct(id: string, clerkUserId: string) {
        // Check if saved product exists and belongs to user
        const savedProduct = await this.savedProductRepository.findByIdAndUser(id, clerkUserId);

        if (!savedProduct) {
            throw new ApiError(404, 'Saved product not found');
        }

        // Delete the saved product
        return this.savedProductRepository.delete(id);
    }
}

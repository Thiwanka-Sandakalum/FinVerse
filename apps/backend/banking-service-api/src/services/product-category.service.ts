import { ProductCategoryRepository, ProductCategoryCreateDto, ProductCategoryUpdateDto } from '../repositories/product-category.repository';

export class ProductCategoryService {
    private productCategoryRepository: ProductCategoryRepository;

    constructor() {
        this.productCategoryRepository = new ProductCategoryRepository();
    }

    /**
     * Get all product categories with optional filtering
     */
    async getAllProductCategories(filters: {
        parentId?: string | null;
        level?: number;
    } = {}) {
        return this.productCategoryRepository.findAll(filters);
    }

    /**
     * Get product category hierarchy
     */
    async getProductCategoryHierarchy() {
        return this.productCategoryRepository.findHierarchy();
    }

    /**
     * Get product category by ID
     */
    async getProductCategoryById(id: string) {
        const category = await this.productCategoryRepository.findById(id);

        if (!category) {
            throw new Error(`Product category with ID ${id} not found`);
        }

        return category;
    }

    /**
     * Create a new product category
     */
    async createProductCategory(data: ProductCategoryCreateDto) {
        // Verify parent exists if specified
        if (data.parentId) {
            const parentExists = await this.productCategoryRepository.findById(data.parentId);
            if (!parentExists) {
                throw new Error(`Parent category with ID ${data.parentId} not found`);
            }

            // Check for circular reference
            if (await this.wouldCreateCircularReference(data.parentId, null)) {
                throw new Error('Creating this parent-child relationship would create a circular reference');
            }
        }

        return this.productCategoryRepository.create(data);
    }

    /**
     * Update a product category
     */
    async updateProductCategory(id: string, data: ProductCategoryUpdateDto) {
        // Check if category exists
        const category = await this.productCategoryRepository.findById(id);
        if (!category) {
            throw new Error(`Product category with ID ${id} not found`);
        }

        // Verify parent exists if specified
        if (data.parentId !== undefined) {
            if (data.parentId) {
                const parentExists = await this.productCategoryRepository.findById(data.parentId);
                if (!parentExists) {
                    throw new Error(`Parent category with ID ${data.parentId} not found`);
                }

                // Check for circular reference
                if (await this.wouldCreateCircularReference(data.parentId, id)) {
                    throw new Error('Updating this parent-child relationship would create a circular reference');
                }

                // Can't set parent to self
                if (data.parentId === id) {
                    throw new Error('A category cannot be its own parent');
                }
            }
        }

        return this.productCategoryRepository.update(id, data);
    }

    /**
     * Delete a product category
     */
    async deleteProductCategory(id: string) {
        // Check if category exists
        const category = await this.productCategoryRepository.findById(id);
        if (!category) {
            throw new Error(`Product category with ID ${id} not found`);
        }

        // Check if there are any children
        if (category.children && category.children.length > 0) {
            throw new Error(`Cannot delete product category with ID ${id} as it has ${category.children.length} child categories`);
        }

        // Check if there are any product types using this category
        if (category.productTypes && category.productTypes.length > 0) {
            throw new Error(`Cannot delete product category with ID ${id} as it is being used by ${category.productTypes.length} product types`);
        }

        return this.productCategoryRepository.delete(id);
    }

    /**
     * Check if creating a parent-child relationship would create a circular reference
     */
    private async wouldCreateCircularReference(parentId: string, childId: string | null): Promise<boolean> {
        // If we're checking for an existing node (updating)
        if (childId !== null) {
            // If parent is the same as child, it's circular
            if (parentId === childId) {
                return true;
            }

            // Check if any ancestor of the new parent is actually the child
            let currentId = parentId;

            while (currentId) {
                const current = await this.productCategoryRepository.findById(currentId);
                if (!current || !current.parentId) {
                    break;
                }

                if (current.parentId === childId) {
                    return true;
                }

                currentId = current.parentId;
            }
        }

        return false;
    }
}

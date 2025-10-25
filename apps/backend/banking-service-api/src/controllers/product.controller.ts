import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../middlewares/error.middleware';
import { ProductCreateDto, ProductUpdateDto, ProductBatchRequestDto } from '../types/api.types';
import { AuthRequest } from '../middlewares/auth.middleware';
import { interactionTracker } from '../services/interaction-tracking.service';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    /**
     * Get all products
     */
    getAllProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
        // Extract query parameters
        const {
            categoryId,
            institutionId,
            productTypeId,
            isFeatured,
            isActive,
            limit,
            offset,
            search
        } = req.query;

        // Convert query parameters to appropriate types
        const filters = {
            categoryId: categoryId as string | undefined,
            institutionId: institutionId as string | undefined,
            productTypeId: productTypeId as string | undefined,
            isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            limit: limit !== undefined ? parseInt(limit as string, 10) : undefined,
            offset: offset !== undefined ? parseInt(offset as string, 10) : undefined,
            search: search ? String(search) : undefined
        };

        // Get products with filters and user context for saved indicator
        const result = await this.productService.getAllProducts(filters, req.user?.userId, req.user?.institutionId);

        // Track search interaction if there's a search query or filters
        if (search || categoryId || institutionId || productTypeId) {
            this.trackSearchInteraction(req, filters, result.meta.total).catch(error => {
                console.error('Failed to track search interaction:', error);
            });
        }

        // Return products with pagination metadata
        res.status(200).json({
            data: result.products,
            meta: result.meta
        });
    });

    /**
     * Track search interaction
     */
    private async trackSearchInteraction(req: AuthRequest, filters: any, resultCount: number): Promise<void> {
        try {
            console.log('🚀 CONTROLLER - Starting search tracking for:', {
                query: filters.search || '',
                filters: {
                    categoryId: filters.categoryId,
                    institutionId: filters.institutionId,
                    productTypeId: filters.productTypeId
                },
                resultCount,
                userId: req.user?.userId || 'anonymous'
            });

            await interactionTracker.trackSearch(req, filters.search || '', resultCount, {
                categoryId: filters.categoryId,
                institutionId: filters.institutionId,
                productTypeId: filters.productTypeId,
                isFeatured: filters.isFeatured,
                isActive: filters.isActive
            });

            console.log('✅ CONTROLLER - Search tracking completed');
        } catch (error) {
            console.error('❌ CONTROLLER - Error in trackSearchInteraction:', error);
        }
    }    /**
     * Get product by ID
     */
    getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const userInstitutionId = req.user?.institutionId;
        const product = await this.productService.getProductById(id, req.user?.userId, userInstitutionId);

        // Track product view interaction asynchronously
        // This should not block the response
        this.trackProductViewInteraction(req, product).catch(error => {
            // Log error but don't fail the request
            console.error('Failed to track product view:', error);
        });

        res.status(200).json(product);
    });

    /**
     * Get products by array of IDs
     */
    getProductsByIds = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { productIds }: ProductBatchRequestDto = req.body;

        // Validate request body
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                error: 'productIds array is required and must not be empty'
            });
        }

        // Validate array contains only strings
        if (productIds.some(id => typeof id !== 'string')) {
            return res.status(400).json({
                error: 'All product IDs must be strings'
            });
        }

        // Limit the number of IDs to prevent abuse
        if (productIds.length > 100) {
            return res.status(400).json({
                error: 'Maximum 100 product IDs allowed per request'
            });
        }

        const userInstitutionId = req.user?.institutionId;
        const products = await this.productService.getProductsByIds(productIds, req.user?.userId, userInstitutionId);

        // Track batch product view interaction asynchronously
        this.trackBatchProductViewInteraction(req, products).catch((error: any) => {
            console.error('Failed to track batch product view:', error);
        });

        res.status(200).json({
            data: products,
            meta: {
                requested: productIds.length,
                found: products.length,
                notFound: productIds.length - products.length
            }
        });
    });

    /**
     * Get product fields by product type ID
     */
    getProductFieldsByType = asyncHandler(async (req: Request, res: Response) => {
        const { productTypeId } = req.params;
        const fields = await this.productService.getProductFieldsByType(productTypeId);

        res.status(200).json({
            data: fields,
            productTypeId
        });
    });

    /**
     * Track product view interaction
     */
    private async trackProductViewInteraction(req: AuthRequest, product: any): Promise<void> {
        try {
            console.log('🚀 CONTROLLER - Starting product view tracking for:', {
                productId: product.id,
                productName: product.name,
                userId: req.user?.userId || 'anonymous'
            });

            await interactionTracker.trackProductView(req, product);

            console.log('✅ CONTROLLER - Product view tracking completed');
        } catch (error) {
            // Log error but don't throw to avoid breaking the main functionality
            console.error('❌ CONTROLLER - Error in trackProductViewInteraction:', error);
        }
    }

    /**
     * Track batch product view interaction
     */
    private async trackBatchProductViewInteraction(req: AuthRequest, products: any[]): Promise<void> {
        try {
            console.log('🚀 CONTROLLER - Starting batch product view tracking for:', {
                productCount: products.length,
                userId: req.user?.userId || 'anonymous'
            });

            // Track each product view individually
            for (const product of products) {
                await interactionTracker.trackProductView(req, product);
            }

            console.log('✅ CONTROLLER - Batch product view tracking completed');
        } catch (error) {
            // Log error but don't throw to avoid breaking the main functionality
            console.error('❌ CONTROLLER - Error in trackBatchProductViewInteraction:', error);
        }
    }    /**
     * Create product
     */
    createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
        const productData: ProductCreateDto = req.body;
        const userInstitutionId = req.user?.institutionId;

        // If user has institutionId, ensure product is created for their institution only
        if (userInstitutionId) {
            productData.institutionId = userInstitutionId;
        }

        const product = await this.productService.createProduct(productData, userInstitutionId);
        res.status(201).json(product);
    });

    /**
     * Update product
     */
    updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const productData: ProductUpdateDto = req.body;
        const userInstitutionId = req.user?.institutionId;

        const product = await this.productService.updateProduct(id, productData, userInstitutionId);
        res.status(200).json(product);
    });

    /**
     * Delete product
     */
    deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const userInstitutionId = req.user?.institutionId;

        await this.productService.deleteProduct(id, userInstitutionId);
        res.status(200).json({ message: 'Product deleted successfully' });
    });

    /**
     * Activate/deactivate product
     */
    activateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const { isActive } = req.body;
        const userInstitutionId = req.user?.institutionId;

        await this.productService.setProductActiveStatus(id, isActive, userInstitutionId);
        res.status(200).json({
            message: `Product ${isActive ? 'activated' : 'deactivated'} successfully`
        });
    });
}

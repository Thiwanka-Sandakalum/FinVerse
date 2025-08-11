import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../middlewares/error.middleware';
import { ProductCreateDto, ProductUpdateDto } from '../types/api.types';
import { AuthRequest } from '../middlewares/auth.middleware';

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

        // Return products with pagination metadata
        res.status(200).json({
            data: result.products,
            meta: result.meta
        });
    });

    /**
     * Get product by ID
     */
    getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const userInstitutionId = req.user?.institutionId;
        const product = await this.productService.getProductById(id, req.user?.userId, userInstitutionId);
        res.status(200).json(product);
    });

    /**
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

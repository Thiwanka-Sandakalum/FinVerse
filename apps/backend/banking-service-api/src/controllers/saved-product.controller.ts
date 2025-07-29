import { Request, Response } from 'express';
import { SavedProductService } from '../services/saved-product.service';
import { asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../types/api.types';

export class SavedProductController {
    private savedProductService: SavedProductService;

    constructor() {
        this.savedProductService = new SavedProductService();
    }

    /**
     * Get all saved products for the authenticated user
     */
    getAllSavedProducts = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const savedProducts = await this.savedProductService.getAllSavedProducts(clerkUserId);
        res.status(200).json(savedProducts);
    });

    /**
     * Save a product for the authenticated user
     */
    saveProduct = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const { productId } = req.body;
        const savedProduct = await this.savedProductService.saveProduct(clerkUserId, productId);
        res.status(201).json(savedProduct);
    });

    /**
     * Delete a saved product
     */
    deleteSavedProduct = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const { id } = req.params;
        await this.savedProductService.deleteSavedProduct(id, clerkUserId);
        res.status(200).json({ message: 'Product removed from saved list' });
    });
}

import { Request, Response } from 'express';
import { SharedLinkService } from '../services/shared-link.service';
import { asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../types/api.types';

export class SharedLinkController {
    private sharedLinkService: SharedLinkService;

    constructor() {
        this.sharedLinkService = new SharedLinkService();
    }

    /**
     * Get all shared links for the authenticated user
     */
    getAllSharedLinks = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const sharedLinks = await this.sharedLinkService.getAllSharedLinks(clerkUserId);
        res.status(200).json(sharedLinks);
    });

    /**
     * Share a product
     */
    shareProduct = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const { productId, channel } = req.body;
        const sharedLink = await this.sharedLinkService.shareProduct(clerkUserId, productId, channel);
        res.status(201).json(sharedLink);
    });
}

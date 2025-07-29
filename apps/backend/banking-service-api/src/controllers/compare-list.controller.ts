import { Request, Response } from 'express';
import { CompareListService } from '../services/compare-list.service';
import { asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../types/api.types';

export class CompareListController {
    private compareListService: CompareListService;

    constructor() {
        this.compareListService = new CompareListService();
    }

    /**
     * Get all compare lists for the authenticated user
     */
    getAllCompareLists = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const compareLists = await this.compareListService.getAllCompareLists(clerkUserId);
        res.status(200).json(compareLists);
    });

    /**
     * Create a compare list for the authenticated user
     */
    createCompareList = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const { productIds } = req.body;
        const compareList = await this.compareListService.createCompareList(clerkUserId, productIds);
        res.status(201).json(compareList);
    });

    /**
     * Delete a compare list
     */
    deleteCompareList = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const { id } = req.params;
        await this.compareListService.deleteCompareList(id, clerkUserId);
        res.status(200).json({ message: 'Compare list deleted successfully' });
    });
}

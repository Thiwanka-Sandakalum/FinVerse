import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../types/api.types';

export class ReviewController {
    private reviewService: ReviewService;

    constructor() {
        this.reviewService = new ReviewService();
    }

    /**
     * Get all reviews for a product
     */
    getProductReviews = asyncHandler(async (req: Request, res: Response) => {
        const { productId } = req.params;
        const reviews = await this.reviewService.getProductReviews(productId);
        res.status(200).json(reviews);
    });

    /**
     * Get all reviews by the authenticated user
     */
    getUserReviews = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const reviews = await this.reviewService.getUserReviews(clerkUserId);
        res.status(200).json(reviews);
    });

    /**
     * Create a review
     */
    createReview = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const { productId, rating, comment } = req.body;
        const review = await this.reviewService.createReview(clerkUserId, productId, rating, comment);
        res.status(201).json(review);
    });

    /**
     * Update a review
     */
    updateReview = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const { id } = req.params;
        const { rating, comment } = req.body;
        const review = await this.reviewService.updateReview(id, clerkUserId, rating, comment);
        res.status(200).json(review);
    });

    /**
     * Delete a review
     */
    deleteReview = asyncHandler(async (req: Request, res: Response) => {
        const authReq = req as AuthRequest;
        const clerkUserId = authReq.user?.userId as string;
        const { id } = req.params;
        await this.reviewService.deleteReview(id, clerkUserId);
        res.status(200).json({ message: 'Review deleted successfully' });
    });
}

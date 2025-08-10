import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
// import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const reviewController = new ReviewController();

// Public routes
router.get('/:productId', reviewController.getProductReviews);

// Protected routes

router.get('/user', reviewController.getUserReviews);
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export default router;

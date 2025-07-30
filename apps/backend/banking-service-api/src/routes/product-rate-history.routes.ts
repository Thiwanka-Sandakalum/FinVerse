import { Router } from 'express';
import { ProductRateHistoryController } from '../controllers/product-rate-history.controller';


const router = Router();
const productRateHistoryController = new ProductRateHistoryController();

/**
 * @route   GET /api/products/:productId/rates
 * @desc    Get rate history for a product
 * @access  Public
 */
router.get('/:productId/rates', productRateHistoryController.getByProductId);

/**
 * @route   GET /api/products/:productId/rates/:metric/latest
 * @desc    Get latest rate for a product by metric
 * @access  Public
 */
router.get('/:productId/rates/:metric/latest', productRateHistoryController.getLatestRate);

/**
 * @route   POST /api/products/:productId/rates
 * @desc    Add a new rate history entry
 * @access  Admin
 */
router.post('/:productId/rates', productRateHistoryController.addRate);

/**
 * @route   DELETE /api/products/:productId/rates
 * @desc    Delete all rate history for a product
 * @access  Admin
 */
router.delete('/:productId/rates', productRateHistoryController.deleteRateHistory);

export default router;

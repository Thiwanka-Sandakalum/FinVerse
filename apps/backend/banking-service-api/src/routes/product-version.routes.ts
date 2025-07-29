import { Router } from 'express';
import { ProductVersionController } from '../controllers/product-version.controller';

const router = Router();
const productVersionController = new ProductVersionController();

/**
 * @route   GET /api/products/:productId/versions
 * @desc    Get version history for a product
 * @access  Public
 */
router.get('/:productId/versions', productVersionController.getVersionHistory);

/**
 * @route   GET /api/products/:productId/versions/latest
 * @desc    Get latest version of a product
 * @access  Public
 */
router.get('/:productId/versions/latest', productVersionController.getLatestVersion);

/**
 * @route   GET /api/products/:productId/versions/:versionNumber
 * @desc    Get a specific version of a product
 * @access  Public
 */
router.get('/:productId/versions/:versionNumber', productVersionController.getProductVersion);

export default router;

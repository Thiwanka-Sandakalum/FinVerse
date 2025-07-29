import { Router } from 'express';
import { ProductTypeController } from '../controllers/product-type.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();
const productTypeController = new ProductTypeController();

/**
 * @route   GET /api/product-types
 * @desc    Get all product types
 * @access  Public
 */
router.get('/', productTypeController.getAll);

/**
 * @route   GET /api/product-types/:id
 * @desc    Get product type by ID
 * @access  Public
 */
router.get('/:id', productTypeController.getById);

/**
 * @route   POST /api/product-types
 * @desc    Create a new product type
 * @access  Admin
 */
router.post('/', authenticateJwt, productTypeController.create);

/**
 * @route   PUT /api/product-types/:id
 * @desc    Update a product type
 * @access  Admin
 */
router.put('/:id', authenticateJwt, productTypeController.update);

/**
 * @route   DELETE /api/product-types/:id
 * @desc    Delete a product type
 * @access  Admin
 */
router.delete('/:id', authenticateJwt, productTypeController.delete);

export default router;

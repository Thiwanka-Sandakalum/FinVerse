import { Router } from 'express';
import { ProductTypeController } from '../controllers/product-type.controller';


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
router.post('/', productTypeController.create);

/**
 * @route   PUT /api/product-types/:id
 * @desc    Update a product type
 * @access  Admin
 */
router.put('/:id', productTypeController.update);

/**
 * @route   DELETE /api/product-types/:id
 * @desc    Delete a product type
 * @access  Admin
 */
router.delete('/:id', productTypeController.delete);

export default router;

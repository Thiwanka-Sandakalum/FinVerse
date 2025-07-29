import { Router } from 'express';
import { ProductCategoryController } from '../controllers/product-category.controller';

const router = Router();
const productCategoryController = new ProductCategoryController();

/**
 * @route   GET /api/product-categories
 * @desc    Get all product categories
 * @access  Public
 */
router.get('/', productCategoryController.getAll);

/**
 * @route   GET /api/product-categories/hierarchy
 * @desc    Get product category hierarchy
 * @access  Public
 */
router.get('/hierarchy', productCategoryController.getHierarchy);

/**
 * @route   GET /api/product-categories/:id
 * @desc    Get product category by ID
 * @access  Public
 */
router.get('/:id', productCategoryController.getById);

/**
 * @route   POST /api/product-categories
 * @desc    Create a new product category
 * @access  Admin
 */
router.post('/', productCategoryController.create);

/**
 * @route   PUT /api/product-categories/:id
 * @desc    Update a product category
 * @access  Admin
 */
router.put('/:id', productCategoryController.update);

/**
 * @route   DELETE /api/product-categories/:id
 * @desc    Delete a product category
 * @access  Admin
 */
router.delete('/:id', productCategoryController.delete);

export default router;

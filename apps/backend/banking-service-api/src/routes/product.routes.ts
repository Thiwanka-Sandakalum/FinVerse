import { Router } from 'express';
import {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller';
import {
    getAllProductCategoriesController,
    createProductCategoryController,
    getProductCategoryByIdController,
    updateProductCategoryController,
    deleteProductCategoryController,
    getProductCategoryHierarchyController,
    getCategoryFieldsController,
    addCategoryFieldController,
    getFieldDefinitionController,
    updateFieldDefinitionController,
    deleteFieldDefinitionController
} from '../controllers/product-category.controller';
import {
    saveProduct,
    unsaveProduct,
    toggleSaveProduct,
    getUserSavedProducts,
    checkProductSaveStatus
} from '../controllers/saved-product.controller';
import { institutionContextMiddleware } from '../middlewares/institution-context.middleware';
import { validateProductAccessMiddleware } from '../middlewares/product-access.middleware';

const router = Router();

// Product Category Fields Routes
router.get('/categories/:categoryId/fields', getCategoryFieldsController);
router.post('/categories/:categoryId/fields', addCategoryFieldController);
router.get('/categories/:categoryId/fields/:fieldId', getFieldDefinitionController);
router.put('/categories/:categoryId/fields/:fieldId', updateFieldDefinitionController);
router.delete('/categories/:categoryId/fields/:fieldId', deleteFieldDefinitionController);

// Product Categories Routes
router.get('/categories', getAllProductCategoriesController);
router.post('/categories', createProductCategoryController);
router.get('/categories/hierarchy', getProductCategoryHierarchyController);
router.get('/categories/:id', getProductCategoryByIdController);
router.put('/categories/:id', updateProductCategoryController);
router.delete('/categories/:id', deleteProductCategoryController);

// Saved Products Routes (User-specific)
router.get('/saved', institutionContextMiddleware, getUserSavedProducts);
router.post('/:productId/save', institutionContextMiddleware, saveProduct);
router.delete('/:productId/save', institutionContextMiddleware, unsaveProduct);
router.put('/:productId/save', institutionContextMiddleware, toggleSaveProduct);
router.get('/:productId/save-status', institutionContextMiddleware, checkProductSaveStatus);

// Product Routes
router.get('/', institutionContextMiddleware, getAllProducts);
router.post('/', institutionContextMiddleware, createProduct);
router.get('/:id', institutionContextMiddleware, validateProductAccessMiddleware, getProductById);
router.put('/:id', institutionContextMiddleware, validateProductAccessMiddleware, updateProduct);
router.delete('/:id', institutionContextMiddleware, validateProductAccessMiddleware, deleteProduct);


export default router;

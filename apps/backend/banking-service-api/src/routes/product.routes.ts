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
import { institutionContextMiddleware } from '../middleware/institution-context.middleware';
import { validateProductAccessMiddleware } from '../middleware/product-access.middleware';
import { checkProductSaveStatusController, getUserSavedProductsController, saveProductController, toggleSaveProductController, unsaveProductController } from '../controllers/saved-product.controller';

const router = Router();

router.get('/categories/:categoryId/fields', getCategoryFieldsController);
router.post('/categories/:categoryId/fields', addCategoryFieldController);
router.get('/categories/:categoryId/fields/:fieldId', getFieldDefinitionController);
router.put('/categories/:categoryId/fields/:fieldId', updateFieldDefinitionController);
router.delete('/categories/:categoryId/fields/:fieldId', deleteFieldDefinitionController);

router.get('/categories', getAllProductCategoriesController);
router.post('/categories', createProductCategoryController);
router.get('/categories/hierarchy', getProductCategoryHierarchyController);
router.get('/categories/:id', getProductCategoryByIdController);
router.put('/categories/:id', updateProductCategoryController);
router.delete('/categories/:id', deleteProductCategoryController);

router.get('/saved', institutionContextMiddleware, getUserSavedProductsController);
router.post('/:productId/save', institutionContextMiddleware, saveProductController);
router.delete('/:productId/save', institutionContextMiddleware, unsaveProductController);
router.put('/:productId/save', institutionContextMiddleware, toggleSaveProductController);
router.get('/:productId/save-status', institutionContextMiddleware, checkProductSaveStatusController);

router.get('/', institutionContextMiddleware, getAllProducts);
router.post('/', institutionContextMiddleware, createProduct);
router.get('/:id', institutionContextMiddleware, validateProductAccessMiddleware, getProductById);
router.put('/:id', institutionContextMiddleware, validateProductAccessMiddleware, updateProduct);
router.delete('/:id', institutionContextMiddleware, validateProductAccessMiddleware, deleteProduct);


export default router;

import { Router } from 'express';
import { SavedProductController } from '../controllers/saved-product.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const savedProductController = new SavedProductController();

// All routes require authentication
router.use(authenticate);

router.get('/', savedProductController.getAllSavedProducts);
router.post('/', savedProductController.saveProduct);
router.delete('/:id', savedProductController.deleteSavedProduct);

export default router;

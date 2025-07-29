import { Router } from 'express';
import { CompareListController } from '../controllers/compare-list.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const compareListController = new CompareListController();

// All routes require authentication
router.use(authenticate);

router.get('/', compareListController.getAllCompareLists);
router.post('/', compareListController.createCompareList);
router.delete('/:id', compareListController.deleteCompareList);

export default router;

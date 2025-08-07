import { Router } from 'express';
import { CompareListController } from '../controllers/compare-list.controller';

const router = Router();
const compareListController = new CompareListController();

router.get('/', compareListController.getAllCompareLists);
router.get('/:id', compareListController.getCompareList);
router.post('/', compareListController.createCompareList);
router.delete('/:id', compareListController.deleteCompareList);

export default router;

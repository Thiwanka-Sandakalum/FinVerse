import { Router } from 'express';
import { SharedLinkController } from '../controllers/shared-link.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const sharedLinkController = new SharedLinkController();

// All routes require authentication


router.get('/', sharedLinkController.getAllSharedLinks);
router.post('/', sharedLinkController.shareProduct);

export default router;

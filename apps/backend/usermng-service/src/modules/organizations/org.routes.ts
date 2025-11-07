import { Router } from 'express';
import * as OrgController from './org.controller';

const router = Router();
router.post('/', OrgController.createOrganization);
router.get('/', OrgController.getOrganizations);
router.get('/:id', OrgController.getOrganizationById);
router.put('/:id', OrgController.updateOrganization);
router.delete('/:id', OrgController.deleteOrganization);

export default router;

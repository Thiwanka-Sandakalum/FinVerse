/**
 * Organization Routes
 * Defines all HTTP endpoints for organization operations
 */

import { Router } from 'express';
import * as OrganizationController from '../controllers/organization.controller';

const router = Router();

router.post('/', OrganizationController.createOrganization);
router.get('/', OrganizationController.getOrganizations);
router.get('/:id', OrganizationController.getOrganizationById);
router.put('/:id', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization);

export default router;

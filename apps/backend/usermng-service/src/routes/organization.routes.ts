/**
 * Organization Routes
 * Defines all HTTP endpoints for organization operations
 */


import { Router } from 'express';
import * as OrganizationController from '../controllers/organization.controller';
import { onboardOrganization } from '../controllers/onboarding.controller';


const router = Router();

// Onboarding endpoint
router.post('/onboard', onboardOrganization);

router.post('/', OrganizationController.createOrganization);
router.get('/', OrganizationController.getOrganizations);
router.get('/:id', OrganizationController.getOrganizationById);
router.put('/:id', OrganizationController.updateOrganization);
router.delete('/:id', OrganizationController.deleteOrganization);

export default router;

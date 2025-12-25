/**
 * Invitation Routes
 * Defines all HTTP endpoints for organization invitation operations
 */

import { Router } from 'express';
import * as InvitationController from '../controllers/invitation.controller';

const router = Router({ mergeParams: true });

router.post('/', InvitationController.createOrganizationInvitation);
router.get('/', InvitationController.getOrganizationInvitations);
router.delete('/:invitationId', InvitationController.deleteOrganizationInvitation);

export default router;

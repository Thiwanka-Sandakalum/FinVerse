import { Router } from 'express';
import * as InvitationController from './invitation.controller';

const router = Router({ mergeParams: true });
router.post('/', InvitationController.createOrganizationInvitation);
router.get('/', InvitationController.getOrganizationInvitations);
router.delete('/:invitationId', InvitationController.deleteOrganizationInvitation);

export default router;

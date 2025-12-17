/**
 * Member Routes
 * Defines all HTTP endpoints for organization member operations
 */

import { Router } from 'express';
import * as MemberController from '../controllers/member.controller';

const router = Router({ mergeParams: true });

router.get('/', MemberController.getOrganizationMembers);
router.delete('/', MemberController.deleteOrganizationMembers);
router.get('/:userId/roles', MemberController.getOrganizationMemberRoles);
router.post('/:userId/roles', MemberController.assignOrganizationMemberRoles);

export default router;

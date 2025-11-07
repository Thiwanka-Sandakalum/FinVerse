import { Router } from 'express';
import * as MemberController from './member.controller';

const router = Router({ mergeParams: true });
router.get('/', MemberController.getOrganizationMembers);
router.delete('/', MemberController.deleteOrganizationMembers);
router.get('/:userId/roles', MemberController.getOrganizationMemberRoles);
router.post('/:userId/roles', MemberController.assignOrganizationMemberRoles);

export default router;

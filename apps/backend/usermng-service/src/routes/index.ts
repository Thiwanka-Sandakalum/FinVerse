/**
 * Main Routes Index
 * Consolidates all application routes
 */

import { Router } from 'express';
import organizationRoutes from './organization.routes';
import userRoutes from './user.routes';
import memberRoutes from './member.routes';
import invitationRoutes from './invitation.routes';
import roleRoutes from './role.routes';

const router = Router();

// Organization routes (includes onboarding)
router.use('/orgs', organizationRoutes);

// Member routes (nested under organizations)
router.use('/orgs/:orgId/members', memberRoutes);

// Invitation routes (nested under organizations)
router.use('/orgs/:orgId/invitations', invitationRoutes);

// User routes
router.use('/users', userRoutes);

// Role routes
router.use('/roles', roleRoutes);

export default router;

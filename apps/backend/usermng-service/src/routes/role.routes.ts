/**
 * Role Routes
 * Defines all HTTP endpoints for role operations
 */

import { Router } from 'express';
import * as RoleController from '../controllers/role.controller';

const router = Router();

router.get('/', RoleController.getRoles);

export default router;

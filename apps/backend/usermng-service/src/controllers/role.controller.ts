/**
 * Role Controller
 * Handles HTTP requests and responses for role operations
 */

import { Request, Response, NextFunction } from 'express';
import * as RoleService from '../services/role.service';
import { itemResponse } from '../utils/response';

export async function getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const roles = await RoleService.getRoles(req.query);

        itemResponse(
            res,
            roles,
            'Roles retrieved successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

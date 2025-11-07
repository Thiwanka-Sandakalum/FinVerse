import * as RoleService from './role.service';
import { Request, Response, NextFunction } from 'express';

export async function getRoles(req: Request, res: Response, next: NextFunction) {
    try {
        const roles = await RoleService.getRoles(req.query);
        res.json(roles);
    } catch (error) {
        next(error);
    }
}

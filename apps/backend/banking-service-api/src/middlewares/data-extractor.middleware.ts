import { ROLES, Role } from '../types/roles';
import type { NextFunction, Request, Response } from 'express';

const dataExtractorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const institutionId = req.headers['x-institution-id'] as string | undefined;
    const role = req.headers['x-role'] as string | undefined;
    const userId = req.headers['x-user-id'] as string | undefined;

    // Allow missing institutionId only if role is 'superadmin'
    if (role !== ROLES.SUPER_ADMIN && (!institutionId || typeof institutionId !== 'string')) {
        return res.status(400).json({ message: 'Missing or invalid x-institution-id header' });
    }

    const allowedRoles: string[] = Object.values(ROLES);
    if (!role || typeof role !== 'string' || !allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Missing or invalid x-role header' });
    }

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid x-user-id header' });
    }

    (req as any).institutionId = institutionId;
    (req as any).role = role as Role;
    (req as any).userId = userId;
    next();
};

export default dataExtractorMiddleware;

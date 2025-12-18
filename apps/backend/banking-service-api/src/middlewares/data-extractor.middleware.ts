import { ROLES, Role } from '../types/roles';
import type { NextFunction, Request, Response } from 'express';

const dataExtractorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const institutionId = req.headers['x-institution-id'] as string | undefined;
    const role = req.headers['x-role'] as string | undefined;
    const userId = req.headers['x-user-id'] as string | undefined;
    (req as any).institutionId = institutionId;
    (req as any).role = role as Role;
    (req as any).userId = userId;
    next();
};

export default dataExtractorMiddleware;

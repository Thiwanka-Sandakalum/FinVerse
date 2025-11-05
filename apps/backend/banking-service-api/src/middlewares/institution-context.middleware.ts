import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/roles';

interface InstitutionContextRequest extends Request {
    institutionContext?: {
        institutionId: string | undefined;
        role: Role;
        userId?: string;
    };
}

export const institutionContextMiddleware = (
    req: InstitutionContextRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = (req as any).role as Role;
        const userId = (req as any).user?.userId;
        let institutionId: string | undefined = (req as any).institutionId;

        // If user role is SUPER_ADMIN, allow institutionId from query
        if (role === 'SUPER_ADMIN' && req.query.institutionId) {
            institutionId = req.query.institutionId as string;
        }

        // Add institution context to request object
        req.institutionContext = {
            institutionId,
            role,
            userId
        };

        next();
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
};
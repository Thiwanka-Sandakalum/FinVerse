import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/roles';
import { apiError } from '../utils/response';

interface InstitutionContextRequest extends Request {
    institutionContext?: {
        institutionId: string | undefined;
        role: Role;
        userId?: string;
    };
}


export function institutionContextMiddleware(
    req: InstitutionContextRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const role = (req as any).role as Role;
        const userId = (req as any).user?.userId;
        let institutionId: string | undefined = (req as any).institutionId;

        if (role === 'SUPER_ADMIN' && req.query.institutionId) {
            institutionId = req.query.institutionId as string;
        }

        req.institutionContext = {
            institutionId,
            role,
            userId
        };
        next();
    } catch (error) {
        return apiError(res, {
            status: 500,
            message: error instanceof Error ? error.message : 'Internal server error',
            code: 'INTERNAL_ERROR',
            details: []
        });
    }
}
import { Request, Response, NextFunction } from 'express';
import { validateProductAccess } from '../utils/product-helpers';
import { apiError } from '../utils/response';


export async function validateProductAccessMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const productId = req.params.id;
        const userInstitutionId = (req as any).institutionId as string;
        const role = (req as any).role;

        if (role === 'SUPER_ADMIN') {
            return next();
        }

        await validateProductAccess(productId, userInstitutionId);
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
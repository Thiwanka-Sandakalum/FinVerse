import { Request, Response, NextFunction } from 'express';
import { validateProductAccess } from '../utils/product-helpers';
import { NotFoundError, ValidationError } from '../utils/error-handler';

export const validateProductAccessMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const productId = req.params.id;
        const userInstitutionId = (req as any).institutionId as string;
        const role = (req as any).role;

        // Skip validation for super admin
        if (role === 'SUPER_ADMIN') {
            return next();
        }

        // Validate product access
        await validateProductAccess(productId, userInstitutionId);
        next();
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({
                code: 404,
                message: error.message
            });
            return;
        }
        if (error instanceof ValidationError) {
            res.status(403).json({
                code: 403,
                message: error.message
            });
            return;
        }
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
};
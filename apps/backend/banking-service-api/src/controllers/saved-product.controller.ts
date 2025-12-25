import { Response, Request, NextFunction } from 'express';
import { logger } from '../config/logger';
import * as savedProductService from '../services/saved-product.service';
import { apiSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';

import { Role } from '../types/roles';

interface RequestWithContext extends Request {
    institutionContext?: {
        institutionId: string | undefined;
        role: Role;
        userId?: string;
    };
    user?: {
        userId: string;
        institutionId?: string;
        role: Role;
    };
}

export const saveProductController = async (req: RequestWithContext, res: Response) => {
    const { productId } = req.params;
    const userId = req.user?.userId || req.institutionContext?.userId;
    try {
        if (!userId) {
            throw new AppError(401, 'User authentication required', 'UNAUTHORIZED');
        }
        const result = await savedProductService.saveProduct(userId, productId);
        logger.info('Product saved successfully', {
            userId,
            productId,
            savedProductId: result.id
        });
        return apiSuccess(res, {
            status: 201,
            message: 'Product saved successfully',
            data: result,
            meta: { isSaved: true, timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

export const unsaveProductController = async (req: RequestWithContext, res: Response) => {
    const { productId } = req.params;
    const userId = req.user?.userId || req.institutionContext?.userId;
    try {
        if (!userId) {
            throw new AppError(401, 'User authentication required', 'UNAUTHORIZED');
        }
        const result = await savedProductService.unsaveProduct(userId, productId);
        logger.info('Product unsaved successfully', { userId, productId });
        return apiSuccess(res, {
            status: 200,
            message: result.message,
            data: null,
            meta: { isSaved: false, timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

export const toggleSaveProductController = async (req: RequestWithContext, res: Response) => {
    const { productId } = req.params;
    const userId = req.user?.userId || req.institutionContext?.userId;
    try {
        if (!userId) {
            throw new AppError(401, 'User authentication required', 'UNAUTHORIZED');
        }
        const result = await savedProductService.toggleSaveProduct(userId, productId);
        logger.info('Product save toggled successfully', {
            userId,
            productId,
            action: result.action
        });
        return apiSuccess(res, {
            status: 200,
            message: result.message,
            data: result.savedProduct || null,
            meta: {
                action: result.action,
                isSaved: result.isSaved,
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

export const getUserSavedProductsController = async (req: RequestWithContext, res: Response) => {
    const userId = req.user?.userId || req.institutionContext?.userId;
    try {
        if (!userId) {
            throw new AppError(401, 'User authentication required', 'UNAUTHORIZED');
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const result = await savedProductService.getUserSavedProducts(userId, page, limit);
        logger.info('Retrieved user saved products', {
            userId,
            count: result.savedProducts.length,
            total: result.meta.total
        });
        return apiSuccess(res, {
            status: 200,
            message: 'User saved products fetched successfully',
            data: result.savedProducts,
            meta: {
                total: result.meta.total,
                limit: result.meta.limit,
                offset: (result.meta.page - 1) * result.meta.limit,
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

export const checkProductSaveStatusController = async (req: RequestWithContext, res: Response) => {
    const { productId } = req.params;
    const userId = req.user?.userId || req.institutionContext?.userId;
    try {
        if (!userId) {
            throw new AppError(401, 'User authentication required', 'UNAUTHORIZED');
        }
        const result = await savedProductService.checkProductSaveStatus(userId, productId);
        return apiSuccess(res, {
            status: 200,
            message: 'Checked product save status',
            data: result,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};
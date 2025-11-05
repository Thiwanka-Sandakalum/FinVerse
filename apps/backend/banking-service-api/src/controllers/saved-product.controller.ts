import { Response, Request } from 'express';
import { logger } from '../config/logger';
import * as savedProductService from '../services/saved-product.service';
import { createErrorResponse, createPaginatedResponse } from '../utils/response.utils';
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

export const saveProduct = async (req: RequestWithContext, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.userId || req.institutionContext?.userId;

        if (!userId) {
            return res.status(401).json(createErrorResponse(401, 'User authentication required'));
        }

        const result = await savedProductService.saveProduct(userId, productId);

        logger.info('Product saved successfully', {
            userId,
            productId,
            savedProductId: result.id
        });

        res.status(201).json({
            message: 'Product saved successfully',
            data: result,
            isSaved: true
        });
    } catch (error) {
        logger.error('Error saving product:', error);

        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                return res.status(404).json(createErrorResponse(404, error.message));
            }
            if (error.message.includes('already saved')) {
                return res.status(409).json(createErrorResponse(409, error.message));
            }
        }

        res.status(500).json(createErrorResponse(500, 'Internal server error'));
    }
};

export const unsaveProduct = async (req: RequestWithContext, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.userId || req.institutionContext?.userId;

        if (!userId) {
            return res.status(401).json(createErrorResponse(401, 'User authentication required'));
        }

        const result = await savedProductService.unsaveProduct(userId, productId);

        logger.info('Product unsaved successfully', { userId, productId });

        res.status(200).json({
            message: result.message,
            isSaved: false
        });
    } catch (error) {
        logger.error('Error unsaving product:', error);

        if (error instanceof Error && error.message.includes('not saved')) {
            return res.status(404).json(createErrorResponse(404, error.message));
        }

        res.status(500).json(createErrorResponse(500, 'Internal server error'));
    }
};

export const toggleSaveProduct = async (req: RequestWithContext, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.userId || req.institutionContext?.userId;

        if (!userId) {
            return res.status(401).json(createErrorResponse(401, 'User authentication required'));
        }

        const result = await savedProductService.toggleSaveProduct(userId, productId);

        logger.info('Product save toggled successfully', {
            userId,
            productId,
            action: result.action
        });

        res.status(200).json({
            message: result.message,
            action: result.action,
            isSaved: result.isSaved,
            data: result.savedProduct || null
        });
    } catch (error) {
        logger.error('Error toggling product save:', error);

        if (error instanceof Error && error.message.includes('not found')) {
            return res.status(404).json(createErrorResponse(404, error.message));
        }

        res.status(500).json(createErrorResponse(500, 'Internal server error'));
    }
};

export const getUserSavedProducts = async (req: RequestWithContext, res: Response) => {
    try {
        const userId = req.user?.userId || req.institutionContext?.userId;

        if (!userId) {
            return res.status(401).json(createErrorResponse(401, 'User authentication required'));
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await savedProductService.getUserSavedProducts(userId, page, limit);

        logger.info('Retrieved user saved products', {
            userId,
            count: result.savedProducts.length,
            total: result.meta.total
        });

        res.status(200).json(createPaginatedResponse(
            result.savedProducts,
            result.meta.total,
            result.meta.limit,
            (result.meta.page - 1) * result.meta.limit
        ));
    } catch (error) {
        logger.error('Error getting user saved products:', error);
        res.status(500).json(createErrorResponse(500, 'Internal server error'));
    }
};

export const checkProductSaveStatus = async (req: RequestWithContext, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.userId || req.institutionContext?.userId;

        if (!userId) {
            return res.status(401).json(createErrorResponse(401, 'User authentication required'));
        }

        const result = await savedProductService.checkProductSaveStatus(userId, productId);

        res.status(200).json(result);
    } catch (error) {
        logger.error('Error checking product save status:', error);
        res.status(500).json(createErrorResponse(500, 'Internal server error'));
    }
};
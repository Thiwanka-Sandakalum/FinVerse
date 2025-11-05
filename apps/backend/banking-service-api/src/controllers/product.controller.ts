import { Response, Request } from 'express';
import { logger } from '../config/logger';
import * as productService from '../services/product.service';
import * as interactionTracker from '../services/interaction-tracking.service';
import { ProductCreateRequest, ProductUpdateRequest, ErrorResponse, MessageResponse, PaginatedResponse } from '../types';
import { Role } from '../types/roles';
import { createErrorResponse, createMessageResponse, createPaginatedResponse } from '../utils/response.utils';
// Types
interface ProductFilters {
    categoryId?: string;
    institutionId?: string;
    isFeatured?: boolean;
    isActive?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
}

interface RequestWithContext extends Request {
    institutionContext?: {
        institutionId: string | undefined;
        role: Role;
        userId?: string;
    };
}

// Controller functions
export const getAllProducts = async (req: RequestWithContext, res: Response) => {
    const { institutionId, userId } = req.institutionContext || {};

    const result = await productService.getAllProducts(req.query, userId, institutionId);

    // Track search interaction asynchronously
    if (req.query.search || req.query.categoryId || institutionId) {
        trackSearchInteraction(req, req.query, result.meta.total).catch(error => {
            logger.error('Failed to track search interaction:', error);
        });
    }

    res.status(200).json(createPaginatedResponse(
        result.products,
        result.meta.total,
        result.meta.limit,
        (result.meta.page - 1) * result.meta.limit
    ));
}

export const getProductById = async (req: RequestWithContext, res: Response) => {
    const { id } = req.params;
    const { institutionId, userId } = req.institutionContext || {};
    const product = await productService.getProductById(id);

    // Track product view asynchronously
    trackProductView(req, product).catch(error => {
        logger.error('Failed to track product view:', error);
    });

    res.status(200).json(product);
}

export const getProductsByIds = async (req: RequestWithContext, res: Response) => {
    const productIds = req.body.productIds;
    const { institutionId, userId } = req.institutionContext || {};
    const products = await productService.getProductsByIds(productIds);

    // Track batch product views asynchronously
    Promise.all(products.map((product: any) => trackProductView(req, product))).catch(error => {
        logger.error('Failed to track batch product view:', error);
    });

    res.status(200).json({
        data: products,
        meta: {
            total: products.length,
            limit: productIds.length,
            offset: 0
        }
    });
}

export const getProductFieldsByCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const fields = await productService.getProductFieldsByCategory(categoryId);

    res.status(200).json({
        data: fields,
        categoryId
    });
}

export const createProduct = async (req: RequestWithContext, res: Response) => {
    const productData = req.body;
    const { institutionId } = req.institutionContext || {};

    if (!institutionId) {
        return res.status(400).json({ error: 'institutionId is required' });
    }

    const product = await productService.createProduct(productData, institutionId);

    res.status(201).json(product);
}

export const updateProduct = async (req: RequestWithContext, res: Response) => {
    const { id } = req.params;
    const productData = req.body;
    const { institutionId } = req.institutionContext || {};
    const product = await productService.updateProduct(id, productData);

    res.status(200).json(product);
}

export const deleteProduct = async (req: RequestWithContext, res: Response) => {
    const { id } = req.params;
    await productService.deleteProduct(id);

    res.status(200).json(createMessageResponse('Product deleted successfully'));
}

const trackSearchInteraction = async (req: Request, filters: ProductFilters, resultCount: number): Promise<void> => {
    try {
        logger.info('Starting search tracking', {
            query: filters.search || '',
            filters: {
                categoryId: filters.categoryId,
                institutionId: filters.institutionId
            },
            resultCount,
            userId: (req as any).user?.userId || 'anonymous'
        });

        await interactionTracker.trackSearch(req, filters.search || '', resultCount, {
            categoryId: filters.categoryId,
            institutionId: filters.institutionId,
            isFeatured: filters.isFeatured,
            isActive: filters.isActive
        });

        logger.info('Search tracking completed');
    } catch (error) {
        logger.error('Error in trackSearchInteraction:', error);
    }
};

const trackProductView = async (req: Request, product: any): Promise<void> => {
    try {
        logger.info('Starting product view tracking', {
            productId: product.id,
            productName: product.name,
            userId: (req as any).user?.userId || 'anonymous'
        });

        await interactionTracker.trackProductView(req, product);
        logger.info('Product view tracking completed');
    } catch (error) {
        logger.error('Error in trackProductView:', error);
    }
};

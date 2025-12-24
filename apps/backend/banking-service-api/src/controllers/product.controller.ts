import { Response, Request, NextFunction } from 'express';
import { apiSuccess } from '../utils/response';
import * as productService from '../services/product.service';
import { AppError } from '../utils/AppError';
import { Role } from '../types/roles';

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
    return apiSuccess(res, {
        status: 200,
        message: 'Products fetched successfully',
        data: result.products,
        meta: {
            total: result.meta.total,
            limit: result.meta.limit,
            offset: (result.meta.page - 1) * result.meta.limit,
            timestamp: new Date().toISOString()
        }
    });
};

export const getProductById = async (req: RequestWithContext, res: Response) => {
    const { id } = req.params;
    const { institutionId } = req.institutionContext || {};
    const product = await productService.getProductById(id, institutionId);
    if (!product) {
        throw new AppError(404, 'Product not found', 'NOT_FOUND');
    }
    return apiSuccess(res, {
        status: 200,
        message: 'Product fetched successfully',
        data: product,
        meta: { timestamp: new Date().toISOString() }
    });
};

export const getProductsByIds = async (req: RequestWithContext, res: Response) => {
    const productIds = req.body.productIds;
    const products = await productService.getProductsByIds(productIds);
    return apiSuccess(res, {
        status: 200,
        message: 'Products fetched successfully',
        data: products,
        meta: {
            total: products.length,
            limit: productIds.length,
            offset: 0,
            timestamp: new Date().toISOString()
        }
    });
};
export const getProductFieldsByCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const fields = await productService.getProductFieldsByCategory(categoryId);
    return apiSuccess(res, {
        status: 200,
        message: 'Product fields fetched successfully',
        data: fields,
        meta: {
            categoryId,
            timestamp: new Date().toISOString()
        }
    });
};

export const createProduct = async (req: RequestWithContext, res: Response, next: NextFunction) => {
    const productData = req.body;
    const { institutionId } = req.institutionContext || {};
    if (!institutionId) {
        throw new AppError(403, 'Institution ID is required', 'FORBIDDEN');
    }
    const product = await productService.createProduct(productData, institutionId);
    return apiSuccess(res, {
        status: 201,
        message: 'Product created successfully',
        data: product,
        meta: { timestamp: new Date().toISOString() }
    });
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productData = req.body;
    const product = await productService.updateProduct(id, productData);
    if (!product) {
        throw new AppError(404, 'Product not found', 'NOT_FOUND');
    }
    return apiSuccess(res, {
        status: 200,
        message: 'Product updated successfully',
        data: product,
        meta: { timestamp: new Date().toISOString() }
    });
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
        throw new AppError(404, 'Product not found', 'NOT_FOUND');
    }
    return apiSuccess(res, {
        status: 200,
        message: 'Product deleted successfully',
        data: null,
        meta: { timestamp: new Date().toISOString() }
    });
};

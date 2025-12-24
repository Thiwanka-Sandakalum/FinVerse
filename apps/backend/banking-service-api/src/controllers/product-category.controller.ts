import { Request, Response, NextFunction } from 'express';
import { apiSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { ProductCategoryCreateDto, ProductCategoryUpdateDto } from '../types/api.types';
import { addCategoryField, createProductCategory, deleteFieldDefinition, deleteProductCategory, getAllProductCategories, getCategoryFields, getFieldDefinition, getProductCategoryById, getProductCategoryHierarchy, updateFieldDefinition, updateProductCategory } from '../services/product-category.service';


export const getAllProductCategoriesController = async (req: Request, res: Response) => {
    const { parentId, level } = req.query;
    const filters = {
        parentId: parentId === 'null' ? null : parentId as string | undefined,
        level: level !== undefined ? parseInt(level as string, 10) : undefined
    };
    const categories = await getAllProductCategories(filters);
    return apiSuccess(res, {
        status: 200,
        message: 'Product categories fetched successfully',
        data: categories,
        meta: {
            total: categories.length,
            limit: categories.length,
            offset: 0,
            timestamp: new Date().toISOString()
        }
    });
};

/**
 * Get product category hierarchy
 */
export const getProductCategoryHierarchyController = async (req: Request, res: Response) => {
    const hierarchy = await getProductCategoryHierarchy();
    return apiSuccess(res, {
        status: 200,
        message: 'Product category hierarchy fetched successfully',
        data: hierarchy,
        meta: { timestamp: new Date().toISOString() }
    });
};

/**
 * Get product category by ID
 */
export const getProductCategoryByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const category = await getProductCategoryById(id);
        if (!category) {
            throw new AppError(404, 'Product category not found', 'NOT_FOUND');
        }
        return apiSuccess(res, {
            status: 200,
            message: 'Product category fetched successfully',
            data: category,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

/**
 * Create a new product category
 */

export const createProductCategoryController = async (req: Request, res: Response) => {
    const data: ProductCategoryCreateDto = req.body;
    const newCategory = await createProductCategory(data);
    return apiSuccess(res, {
        status: 201,
        message: 'Product category created successfully',
        data: newCategory,
        meta: { timestamp: new Date().toISOString() }
    });
};

/**
 * Update a product category
 */
export const updateProductCategoryController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: ProductCategoryUpdateDto = req.body;
    try {
        const updatedCategory = await updateProductCategory(id, data);
        if (!updatedCategory) {
            throw new AppError(404, 'Product category not found', 'NOT_FOUND');
        }
        return apiSuccess(res, {
            status: 200,
            message: 'Product category updated successfully',
            data: updatedCategory,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

/**
 * Delete a product category
 */
export const deleteProductCategoryController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await deleteProductCategory(id);
        if (!deleted) {
            throw new AppError(404, 'Product category not found', 'NOT_FOUND');
        }
        return apiSuccess(res, {
            status: 200,
            message: `Product category with ID ${id} has been deleted`,
            data: null,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

/**
 * Get all fields for a category
 */
export const getCategoryFieldsController = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
        const fields = await getCategoryFields(categoryId);
        if (!fields) {
            throw new AppError(404, 'Category fields not found', 'NOT_FOUND');
        }
        return apiSuccess(res, {
            status: 200,
            message: 'Category fields fetched successfully',
            data: fields,
            meta: {
                total: fields.length,
                limit: fields.length,
                offset: 0,
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

/**
 * Add a new field to a category
 */
export const addCategoryFieldController = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
        const field = await addCategoryField(categoryId, req.body);
        if (!field) {
            throw new AppError(404, 'Category field not found', 'NOT_FOUND');
        }
        return apiSuccess(res, {
            status: 201,
            message: 'Category field added successfully',
            data: field,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

/**
 * Get a specific field definition
 */
export const getFieldDefinitionController = async (req: Request, res: Response) => {
    const { categoryId, fieldId } = req.params;
    try {
        const field = await getFieldDefinition(categoryId, fieldId);
        if (!field) {
            throw new AppError(404, 'Field definition not found', 'NOT_FOUND');
        }
        return apiSuccess(res, {
            status: 200,
            message: 'Field definition fetched successfully',
            data: field,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

/**
 * Update a field definition
 */
export const updateFieldDefinitionController = async (req: Request, res: Response) => {
    const { categoryId, fieldId } = req.params;
    try {
        const field = await updateFieldDefinition(categoryId, fieldId, req.body);
        if (!field) {
            throw new AppError(404, 'Field definition not found', 'NOT_FOUND');
        }
        return apiSuccess(res, {
            status: 200,
            message: 'Field definition updated successfully',
            data: field,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};

/**
 * Delete a field definition
 */
export const deleteFieldDefinitionController = async (req: Request, res: Response) => {
    const { categoryId, fieldId } = req.params;
    try {
        const deleted = await deleteFieldDefinition(categoryId, fieldId);
        if (!deleted) {
            throw new AppError(404, 'Field definition not found', 'NOT_FOUND');
        }
        return apiSuccess(res, {
            status: 200,
            message: `Field definition with ID ${fieldId} has been deleted`,
            data: null,
            meta: { timestamp: new Date().toISOString() }
        });
    } catch (err) {
        return (req as any).next ? (req as any).next(err) : undefined;
    }
};
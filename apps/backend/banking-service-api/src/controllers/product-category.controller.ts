import { Request, Response } from 'express';
import { ProductCategoryCreateDto, ProductCategoryUpdateDto } from '../types/api.types';
import { addCategoryField, createProductCategory, deleteFieldDefinition, deleteProductCategory, getAllProductCategories, getCategoryFields, getFieldDefinition, getProductCategoryById, getProductCategoryHierarchy, updateFieldDefinition, updateProductCategory } from '../services/product-category.service';

export const getAllProductCategoriesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { parentId, level } = req.query;
        const filters = {
            parentId: parentId === 'null' ? null : parentId as string | undefined,
            level: level !== undefined ? parseInt(level as string, 10) : undefined
        };
        const categories = await getAllProductCategories(filters);
        res.status(200).json({
            data: categories,
            meta: {
                total: categories.length,
                limit: categories.length,
                offset: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Failed to fetch product categories'
        });
    }
};

/**
 * Get product category hierarchy
 */
export const getProductCategoryHierarchyController = async (req: Request, res: Response): Promise<void> => {
    try {
        const hierarchy = await getProductCategoryHierarchy();
        res.status(200).json({ data: hierarchy });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Failed to fetch product category hierarchy'
        });
    }
};

/**
 * Get product category by ID
 */
export const getProductCategoryByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const category = await getProductCategoryById(id);
        res.status(200).json(category);
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ code: 404, message: error.message });
            return;
        }
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Failed to fetch product category'
        });
    }
};

/**
 * Create a new product category
 */
export const createProductCategoryController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data: ProductCategoryCreateDto = req.body;
        const newCategory = await createProductCategory(data);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: error instanceof Error ? error.message : 'Failed to create product category'
        });
    }
};

/**
 * Update a product category
 */
export const updateProductCategoryController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data: ProductCategoryUpdateDto = req.body;
        const updatedCategory = await updateProductCategory(id, data);
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ code: 404, message: error.message });
            return;
        }
        if (error instanceof Error && (error.message.includes('circular reference') || error.message.includes('own parent'))) {
            res.status(400).json({ code: 400, message: error.message });
            return;
        }
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Failed to update product category'
        });
    }
};

/**
 * Delete a product category
 */
export const deleteProductCategoryController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await deleteProductCategory(id);
        res.status(200).json({ message: `Product category with ID ${id} has been deleted` });
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ code: 404, message: error.message });
            return;
        }
        if (error instanceof Error && (error.message.includes('child categories') || error.message.includes('product types'))) {
            res.status(400).json({ code: 400, message: error.message });
            return;
        }
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Failed to delete product category'
        });
    }
};

/**
 * Get all fields for a category
 */
export const getCategoryFieldsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const fields = await getCategoryFields(categoryId);
        res.status(200).json({
            data: fields,
            meta: {
                total: fields.length,
                limit: fields.length,
                offset: 0
            }
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ code: 404, message: error.message });
            return;
        }
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Failed to fetch category fields'
        });
    }
};

/**
 * Add a new field to a category
 */
export const addCategoryFieldController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const field = await addCategoryField(categoryId, req.body);
        res.status(201).json(field);
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ code: 404, message: error.message });
            return;
        }
        res.status(400).json({
            code: 400,
            message: error instanceof Error ? error.message : 'Failed to add category field'
        });
    }
};

/**
 * Get a specific field definition
 */
export const getFieldDefinitionController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, fieldId } = req.params;
        const field = await getFieldDefinition(categoryId, fieldId);
        res.status(200).json(field);
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ code: 404, message: error.message });
            return;
        }
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Failed to fetch field definition'
        });
    }
};

/**
 * Update a field definition
 */
export const updateFieldDefinitionController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, fieldId } = req.params;
        const field = await updateFieldDefinition(categoryId, fieldId, req.body);
        res.status(200).json(field);
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ code: 404, message: error.message });
            return;
        }
        res.status(400).json({
            code: 400,
            message: error instanceof Error ? error.message : 'Failed to update field definition'
        });
    }
};

/**
 * Delete a field definition
 */
export const deleteFieldDefinitionController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, fieldId } = req.params;
        await deleteFieldDefinition(categoryId, fieldId);
        res.status(200).json({ message: `Field definition with ID ${fieldId} has been deleted` });
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ code: 404, message: error.message });
            return;
        }
        if (error instanceof Error && error.message.includes('in use')) {
            res.status(400).json({ code: 400, message: error.message });
            return;
        }
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : 'Failed to delete field definition'
        });
    }
};
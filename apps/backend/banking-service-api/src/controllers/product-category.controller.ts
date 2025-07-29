import { Request, Response } from 'express';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductCategoryCreateDto, ProductCategoryUpdateDto } from '../types/api.types';

export class ProductCategoryController {
    private productCategoryService: ProductCategoryService;

    constructor() {
        this.productCategoryService = new ProductCategoryService();
    }

    /**
     * Get all product categories
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const { parentId, level } = req.query;

            const filters = {
                parentId: parentId === 'null' ? null : parentId as string | undefined,
                level: level !== undefined ? parseInt(level as string, 10) : undefined
            };

            const categories = await this.productCategoryService.getAllProductCategories(filters);

            res.status(200).json({
                data: categories
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
    getHierarchy = async (req: Request, res: Response) => {
        try {
            const hierarchy = await this.productCategoryService.getProductCategoryHierarchy();

            res.status(200).json({
                data: hierarchy
            });
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
    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await this.productCategoryService.getProductCategoryById(id);

            res.status(200).json(category);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
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
    create = async (req: Request, res: Response) => {
        try {
            const data: ProductCategoryCreateDto = req.body;
            const newCategory = await this.productCategoryService.createProductCategory(data);

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
    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data: ProductCategoryUpdateDto = req.body;
            const updatedCategory = await this.productCategoryService.updateProductCategory(id, data);

            res.status(200).json(updatedCategory);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            if (error instanceof Error &&
                (error.message.includes('circular reference') ||
                    error.message.includes('own parent'))) {
                return res.status(400).json({
                    code: 400,
                    message: error.message
                });
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
    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.productCategoryService.deleteProductCategory(id);

            res.status(200).json({
                message: `Product category with ID ${id} has been deleted`
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            if (error instanceof Error &&
                (error.message.includes('child categories') ||
                    error.message.includes('product types'))) {
                return res.status(400).json({
                    code: 400,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to delete product category'
            });
        }
    };
}

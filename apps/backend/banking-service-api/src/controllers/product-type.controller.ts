import { Request, Response } from 'express';
import { ProductTypeService } from '../services/product-type.service';
import { ProductTypeCreateDto, ProductTypeUpdateDto } from '../types/api.types';

export class ProductTypeController {
    private productTypeService: ProductTypeService;

    constructor() {
        this.productTypeService = new ProductTypeService();
    }

    /**
     * Get all product types
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const { categoryId } = req.query;

            const filters = {
                categoryId: categoryId as string | undefined
            };

            const productTypes = await this.productTypeService.getAllProductTypes(filters);

            res.status(200).json({
                data: productTypes
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch product types'
            });
        }
    };

    /**
     * Get product type by ID
     */
    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const productType = await this.productTypeService.getProductTypeById(id);

            res.status(200).json(productType);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch product type'
            });
        }
    };

    /**
     * Create a new product type
     */
    create = async (req: Request, res: Response) => {
        try {
            const data: ProductTypeCreateDto = req.body;
            const newProductType = await this.productTypeService.createProductType(data);

            res.status(201).json(newProductType);
        } catch (error) {
            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to create product type'
            });
        }
    };

    /**
     * Update a product type
     */
    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data: ProductTypeUpdateDto = req.body;
            const updatedProductType = await this.productTypeService.updateProductType(id, data);

            res.status(200).json(updatedProductType);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to update product type'
            });
        }
    };

    /**
     * Delete a product type
     */
    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.productTypeService.deleteProductType(id);

            res.status(200).json({
                message: `Product type with ID ${id} has been deleted`
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            if (error instanceof Error && error.message.includes('being used')) {
                return res.status(400).json({
                    code: 400,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to delete product type'
            });
        }
    };
}

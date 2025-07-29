import { Request, Response } from 'express';
import { ProductVersionService } from '../services/product-version.service';

export class ProductVersionController {
    private productVersionService: ProductVersionService;

    constructor() {
        this.productVersionService = new ProductVersionService();
    }

    /**
     * Get version history for a product
     */
    getVersionHistory = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const { limit } = req.query;

            const options = limit ? {
                limit: parseInt(limit as string, 10)
            } : undefined;

            const versions = await this.productVersionService.getVersionHistory(productId, options);

            res.status(200).json({
                data: versions
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch version history'
            });
        }
    };

    /**
     * Get a specific version of a product
     */
    getProductVersion = async (req: Request, res: Response) => {
        try {
            const { productId, versionNumber } = req.params;

            const version = await this.productVersionService.getProductVersion(
                productId,
                parseInt(versionNumber, 10)
            );

            res.status(200).json(version);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch product version'
            });
        }
    };

    /**
     * Get latest version of a product
     */
    getLatestVersion = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;

            const version = await this.productVersionService.getLatestVersion(productId);

            res.status(200).json(version);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch latest version'
            });
        }
    };
}

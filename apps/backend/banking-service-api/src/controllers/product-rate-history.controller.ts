import { Request, Response } from 'express';
import { ProductRateHistoryService } from '../services/product-rate-history.service';
import { ProductRateHistoryCreateDto } from '../types/api.types';

export class ProductRateHistoryController {
    private productRateHistoryService: ProductRateHistoryService;

    constructor() {
        this.productRateHistoryService = new ProductRateHistoryService();
    }

    /**
     * Get rate history for a product
     */
    getByProductId = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const { metric, startDate, endDate, limit } = req.query;

            const options: any = {};

            if (metric) options.metric = metric as string;
            if (startDate) options.startDate = new Date(startDate as string);
            if (endDate) options.endDate = new Date(endDate as string);
            if (limit) options.limit = parseInt(limit as string, 10);

            const rateHistory = await this.productRateHistoryService.getRateHistory(
                productId,
                options
            );

            res.status(200).json({
                data: rateHistory
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
                message: error instanceof Error ? error.message : 'Failed to fetch rate history'
            });
        }
    };

    /**
     * Get latest rate for a product by metric
     */
    getLatestRate = async (req: Request, res: Response) => {
        try {
            const { productId, metric } = req.params;

            const latestRate = await this.productRateHistoryService.getLatestRate(
                productId,
                metric
            );

            if (!latestRate) {
                return res.status(404).json({
                    code: 404,
                    message: `No rate found for product ${productId} with metric ${metric}`
                });
            }

            res.status(200).json(latestRate);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch latest rate'
            });
        }
    };

    /**
     * Add a new rate history entry
     */
    addRate = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const data: Omit<ProductRateHistoryCreateDto, 'productId'> = req.body;

            const rateEntry = await this.productRateHistoryService.addRateHistoryEntry({
                productId,
                ...data
            });

            res.status(201).json(rateEntry);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to add rate history entry'
            });
        }
    };

    /**
     * Delete all rate history for a product
     */
    deleteRateHistory = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;

            await this.productRateHistoryService.deleteRateHistory(productId);

            res.status(200).json({
                message: `All rate history for product ${productId} has been deleted`
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
                message: error instanceof Error ? error.message : 'Failed to delete rate history'
            });
        }
    };
}

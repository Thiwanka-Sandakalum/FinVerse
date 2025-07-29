import prisma from '../config/database';

export interface ProductRateHistoryCreateDto {
    productId: string;
    metric: string;
    value: number;
    currency?: string;
    recordedAt?: Date;
    source?: string;
}

export class ProductRateHistoryRepository {
    /**
     * Find rate history for a specific product
     */
    async findByProductId(productId: string, options: {
        metric?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    } = {}) {
        const { metric, startDate, endDate, limit = 100 } = options;

        const where: any = { productId };

        if (metric) {
            where.metric = metric;
        }

        if (startDate || endDate) {
            where.recordedAt = {};

            if (startDate) {
                where.recordedAt.gte = startDate;
            }

            if (endDate) {
                where.recordedAt.lte = endDate;
            }
        }

        return prisma.productRateHistory.findMany({
            where,
            orderBy: { recordedAt: 'desc' },
            take: limit
        });
    }

    /**
     * Get the latest rate for a product by metric
     */
    async getLatestRate(productId: string, metric: string) {
        return prisma.productRateHistory.findFirst({
            where: {
                productId,
                metric
            },
            orderBy: { recordedAt: 'desc' }
        });
    }

    /**
     * Add a new rate history entry
     */
    async create(data: ProductRateHistoryCreateDto) {
        return prisma.productRateHistory.create({
            data: {
                ...data,
                recordedAt: data.recordedAt || new Date()
            }
        });
    }

    /**
     * Delete rate history entries for a product
     */
    async deleteByProductId(productId: string) {
        return prisma.productRateHistory.deleteMany({
            where: { productId }
        });
    }
}

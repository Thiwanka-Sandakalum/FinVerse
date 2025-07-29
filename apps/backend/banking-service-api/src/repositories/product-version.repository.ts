import prisma from '../config/database';

export interface ProductVersionCreateDto {
    productId: string;
    versionNumber: number;
    snapshot: Record<string, any>;
    changedBy?: string;
    changeNote?: string;
}

export class ProductVersionRepository {
    /**
     * Find versions for a specific product
     */
    async findByProductId(productId: string, options: {
        limit?: number;
    } = {}) {
        const { limit = 20 } = options;

        return prisma.productVersion.findMany({
            where: { productId },
            orderBy: { versionNumber: 'desc' },
            take: limit
        });
    }

    /**
     * Find a specific version by product ID and version number
     */
    async findByVersionNumber(productId: string, versionNumber: number) {
        return prisma.productVersion.findFirst({
            where: {
                productId,
                versionNumber
            }
        });
    }

    /**
     * Get the latest version for a product
     */
    async getLatestVersion(productId: string) {
        return prisma.productVersion.findFirst({
            where: { productId },
            orderBy: { versionNumber: 'desc' }
        });
    }

    /**
     * Create a new product version
     */
    async create(data: ProductVersionCreateDto) {
        return prisma.productVersion.create({
            data
        });
    }

    /**
     * Delete all versions for a product
     */
    async deleteByProductId(productId: string) {
        return prisma.productVersion.deleteMany({
            where: { productId }
        });
    }
}

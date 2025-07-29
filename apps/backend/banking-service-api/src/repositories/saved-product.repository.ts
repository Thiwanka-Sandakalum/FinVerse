import prisma from '../config/database';
import { AuthRequest } from '../types/api.types';

export class SavedProductRepository {
    /**
     * Find all saved products for a user
     */
    async findAllByUser(clerkUserId: string) {
        return prisma.savedProduct.findMany({
            where: { clerkUserId },
            include: {
                product: {
                    include: {
                        institution: true,
                        productType: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Create a saved product for a user
     */
    async create(clerkUserId: string, productId: string) {
        return prisma.savedProduct.create({
            data: {
                clerkUserId,
                productId
            },
            include: {
                product: {
                    include: {
                        institution: true,
                        productType: true
                    }
                }
            }
        });
    }

    /**
     * Delete a saved product
     */
    async delete(id: string) {
        return prisma.savedProduct.delete({
            where: { id }
        });
    }

    /**
     * Find saved product by ID and verify ownership
     */
    async findByIdAndUser(id: string, clerkUserId: string) {
        return prisma.savedProduct.findFirst({
            where: {
                id,
                clerkUserId
            }
        });
    }

    /**
     * Check if a product is already saved by user
     */
    async findByProductAndUser(productId: string, clerkUserId: string) {
        return prisma.savedProduct.findFirst({
            where: {
                productId,
                clerkUserId
            }
        });
    }
}

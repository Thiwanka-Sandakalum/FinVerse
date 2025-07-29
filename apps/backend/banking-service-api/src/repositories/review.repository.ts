import prisma from '../config/database';

export class ReviewRepository {
    /**
     * Find all reviews for a product
     */
    async findAllByProduct(productId: string) {
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find all reviews by a user
     */
    async findAllByUser(clerkUserId: string) {
        return prisma.review.findMany({
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
     * Create a review
     */
    async create(clerkUserId: string, productId: string, rating: number, comment?: string) {
        return prisma.review.create({
            data: {
                clerkUserId,
                productId,
                rating,
                comment
            },
            include: {
                product: {
                    include: {
                        institution: true
                    }
                }
            }
        });
    }

    /**
     * Update a review
     */
    async update(id: string, rating: number, comment?: string) {
        return prisma.review.update({
            where: { id },
            data: {
                rating,
                comment
            },
            include: {
                product: {
                    include: {
                        institution: true
                    }
                }
            }
        });
    }

    /**
     * Delete a review
     */
    async delete(id: string) {
        return prisma.review.delete({
            where: { id }
        });
    }

    /**
     * Find review by ID
     */
    async findById(id: string) {
        return prisma.review.findUnique({
            where: { id }
        });
    }

    /**
     * Find review by ID and user
     */
    async findByIdAndUser(id: string, clerkUserId: string) {
        return prisma.review.findFirst({
            where: {
                id,
                clerkUserId
            }
        });
    }

    /**
     * Find review by product and user
     */
    async findByProductAndUser(productId: string, clerkUserId: string) {
        return prisma.review.findFirst({
            where: {
                productId,
                clerkUserId
            }
        });
    }
}

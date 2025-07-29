import prisma from '../config/database';

export class SharedLinkRepository {
    /**
     * Find all shared links for a user
     */
    async findAllByUser(clerkUserId: string) {
        return prisma.sharedLink.findMany({
            where: { clerkUserId },
            include: {
                product: {
                    include: {
                        institution: true,
                        productType: true
                    }
                }
            },
            orderBy: { sharedAt: 'desc' }
        });
    }

    /**
     * Create a shared link for a product
     */
    async create(clerkUserId: string | null, productId: string, channel: string) {
        return prisma.sharedLink.create({
            data: {
                clerkUserId,
                productId,
                channel
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
}

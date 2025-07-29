import prisma from '../config/database';

export class CompareListRepository {
    /**
     * Find all compare lists for a user
     */
    async findAllByUser(clerkUserId: string) {
        return prisma.compareList.findMany({
            where: { clerkUserId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Create a compare list for a user
     */
    async create(clerkUserId: string, productIds: string[]) {
        return prisma.compareList.create({
            data: {
                clerkUserId,
                productIds
            }
        });
    }

    /**
     * Delete a compare list
     */
    async delete(id: string) {
        return prisma.compareList.delete({
            where: { id }
        });
    }

    /**
     * Find compare list by ID and verify ownership
     */
    async findByIdAndUser(id: string, clerkUserId: string) {
        return prisma.compareList.findFirst({
            where: {
                id,
                clerkUserId
            }
        });
    }
}

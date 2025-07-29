import prisma from '../config/database';

export class TagRepository {
    /**
     * Find all product tags
     */
    async findAll() {
        return prisma.productTag.findMany({
            orderBy: { name: 'asc' }
        });
    }

    /**
     * Find a tag by ID
     */
    async findById(id: string) {
        return prisma.productTag.findUnique({
            where: { id }
        });
    }

    /**
     * Add a tag to a product
     */
    async addTagToProduct(productId: string, tagId: string) {
        // First check if the tag and product exist
        const [tag, product] = await Promise.all([
            prisma.productTag.findUnique({ where: { id: tagId } }),
            prisma.product.findUnique({ where: { id: productId } })
        ]);

        if (!tag || !product) {
            return null;
        }

        // Check if the tag is already added to the product
        const existing = await prisma.productTagMap.findUnique({
            where: {
                productId_tagId: {
                    productId,
                    tagId
                }
            }
        });

        if (existing) {
            return tag;
        }

        // Add the tag to the product
        await prisma.productTagMap.create({
            data: {
                productId,
                tagId
            }
        });

        return tag;
    }

    /**
     * Remove a tag from a product
     */
    async removeTagFromProduct(productId: string, tagId: string) {
        return prisma.productTagMap.delete({
            where: {
                productId_tagId: {
                    productId,
                    tagId
                }
            }
        });
    }

    /**
     * Find all tags for a product
     */
    async findByProduct(productId: string) {
        const tagMaps = await prisma.productTagMap.findMany({
            where: { productId },
            include: { tag: true }
        });

        return tagMaps.map(map => map.tag);
    }
}

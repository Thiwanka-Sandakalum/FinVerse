import prisma from '../config/database';
import { Prisma } from '@prisma/client';
import { ProductCreateDto, ProductUpdateDto } from '../types/api.types';
import slugify from '../utils/slugify';

export class ProductRepository {
    /**
     * Find all products with filtering options
     */
    async findAll(filters: {
        categoryId?: string;
        institutionId?: string;
        productTypeId?: string;
        isActive?: boolean;
        isFeatured?: boolean;
        limit?: number;
        offset?: number;
        search?: string;
    }) {
        const {
            categoryId,
            institutionId,
            productTypeId,
            isActive,
            isFeatured,
            limit = 20,
            offset = 0,
            search
        } = filters;

        // Build where condition
        const where: Prisma.ProductWhereInput = {};

        if (institutionId) where.institutionId = institutionId;
        if (productTypeId) where.productTypeId = productTypeId;
        if (isActive !== undefined) where.isActive = isActive;
        if (isFeatured !== undefined) where.isFeatured = isFeatured;

        // Handle category ID by joining with product type
        if (categoryId) {
            where.productType = {
                OR: [
                    {
                        category: {
                            parent: {
                                id: categoryId
                            }
                        }
                    },
                    { categoryId: categoryId }
                ]
            };
        }

        // Add search filter (optimized for trigram index)
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { institution: { name: { contains: search, mode: 'insensitive' } } },
                { productType: { name: { contains: search, mode: 'insensitive' } } },
                { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } }
            ];
        }

        // First get total count
        const total = await prisma.product.count({ where });

        // Then get paginated data
        const products = await prisma.product.findMany({
            where,
            include: {
                institution: true,
                productType: {
                    include: {
                        category: true
                    }
                },
                tags: {
                    include: {
                        tag: true
                    }
                }
            },
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });

        return {
            products,
            meta: {
                total,
                limit,
                offset
            }
        };
    }

    /**
     * Find a product by ID
     */
    async findById(id: string) {
        return prisma.product.findUnique({
            where: { id },
            include: {
                institution: true,
                productType: {
                    include: {
                        category: true
                    }
                },
                tags: {
                    include: {
                        tag: true
                    }
                },
                rateHistory: {
                    orderBy: {
                        recordedAt: 'desc'
                    },
                    take: 10
                }
            }
        });
    }

    /**
     * Create a new product
     */
    async create(data: ProductCreateDto) {
        // Generate slug from name
        const slug = slugify(data.name);

        // Create product
        const product = await prisma.product.create({
            data: {
                ...data,
                slug
            },
            include: {
                institution: true,
                productType: true
            }
        });

        // Create initial version
        await prisma.productVersion.create({
            data: {
                productId: product.id,
                versionNumber: 1,
                snapshot: product as any,
                changedBy: 'System', // Or could pass in from service
                changeNote: 'Initial product creation'
            }
        });

        return product;
    }

    /**
     * Update a product
     */
    async update(id: string, data: ProductUpdateDto) {
        // Get current product for versioning
        const currentProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!currentProduct) {
            return null;
        }

        // Update with optional slug if name changes
        const updateData: any = { ...data };
        if (data.name) {
            updateData.slug = slugify(data.name);
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                institution: true,
                productType: true
            }
        });

        // Get latest version number
        const latestVersion = await prisma.productVersion.findFirst({
            where: { productId: id },
            orderBy: { versionNumber: 'desc' },
            select: { versionNumber: true }
        });

        // Create new version
        await prisma.productVersion.create({
            data: {
                productId: id,
                versionNumber: (latestVersion?.versionNumber || 0) + 1,
                snapshot: updatedProduct as any,
                changedBy: 'System', // Or could pass in from service
                changeNote: 'Product update'
            }
        });

        return updatedProduct;
    }

    /**
     * Delete a product
     */
    async delete(id: string) {
        return prisma.product.delete({
            where: { id }
        });
    }

    /**
     * Activate or deactivate a product
     */
    async setActiveStatus(id: string, isActive: boolean) {
        return prisma.product.update({
            where: { id },
            data: { isActive }
        });
    }
}

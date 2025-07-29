import prisma from '../config/database';
import slugify from '../utils/slugify';

export interface ProductCategoryCreateDto {
    parentId?: string;
    name: string;
    description?: string;
}

export interface ProductCategoryUpdateDto {
    parentId?: string;
    name?: string;
    description?: string;
}

export class ProductCategoryRepository {
    /**
     * Find all product categories with optional filtering
     */
    async findAll(filters: {
        parentId?: string | null;
        level?: number;
    } = {}) {
        const { parentId, level } = filters;

        const where: any = {};

        // Filter by parent ID (can be null for root categories)
        if (parentId !== undefined) {
            where.parentId = parentId;
        }

        // Filter by level
        if (level !== undefined) {
            where.level = level;
        }

        return prisma.productCategory.findMany({
            where,
            include: {
                parent: true,
                children: true,
                productTypes: true
            },
            orderBy: { name: 'asc' }
        });
    }

    /**
     * Find product category hierarchy (tree structure)
     */
    async findHierarchy() {
        // First get root categories (those with no parent)
        const rootCategories = await prisma.productCategory.findMany({
            where: { parentId: null },
            include: {
                children: true,
                productTypes: true
            },
            orderBy: { name: 'asc' }
        });

        return rootCategories;
    }

    /**
     * Find a product category by ID
     */
    async findById(id: string) {
        return prisma.productCategory.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                productTypes: true
            }
        });
    }

    /**
     * Create a new product category
     */
    async create(data: ProductCategoryCreateDto) {
        // Generate slug
        const slug = slugify(data.name);

        // Calculate level based on parent
        let level = 0;

        if (data.parentId) {
            const parent = await prisma.productCategory.findUnique({
                where: { id: data.parentId },
                select: { level: true }
            });

            if (parent) {
                level = parent.level + 1;
            }
        }

        return prisma.productCategory.create({
            data: {
                ...data,
                slug,
                level
            },
            include: {
                parent: true
            }
        });
    }

    /**
     * Update a product category
     */
    async update(id: string, data: ProductCategoryUpdateDto) {
        const updateData: any = { ...data };

        // Update slug if name is changing
        if (data.name) {
            updateData.slug = slugify(data.name);
        }

        // Update level if parent is changing
        if (data.parentId !== undefined) {
            let level = 0;

            if (data.parentId) {
                const parent = await prisma.productCategory.findUnique({
                    where: { id: data.parentId },
                    select: { level: true }
                });

                if (parent) {
                    level = parent.level + 1;
                }
            }

            updateData.level = level;
        }

        return prisma.productCategory.update({
            where: { id },
            data: updateData,
            include: {
                parent: true
            }
        });
    }

    /**
     * Delete a product category
     */
    async delete(id: string) {
        return prisma.productCategory.delete({
            where: { id }
        });
    }
}

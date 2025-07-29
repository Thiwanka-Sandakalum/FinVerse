import prisma from '../config/database';

export interface ProductTypeCreateDto {
    categoryId: string;
    code: string;
    name: string;
    description?: string;
}

export interface ProductTypeUpdateDto {
    categoryId?: string;
    name?: string;
    description?: string;
}

export class ProductTypeRepository {
    /**
     * Find all product types with filtering options
     */
    async findAll(filters: {
        categoryId?: string;
    } = {}) {
        const { categoryId } = filters;

        const where: any = {};

        if (categoryId) {
            where.categoryId = categoryId;
        }

        return prisma.productType.findMany({
            where,
            include: {
                category: true
            },
            orderBy: { name: 'asc' }
        });
    }

    /**
     * Find a product type by ID
     */
    async findById(id: string) {
        return prisma.productType.findUnique({
            where: { id },
            include: {
                category: true,
                products: {
                    where: { isActive: true },
                    take: 10
                }
            }
        });
    }

    /**
     * Find a product type by code
     */
    async findByCode(code: string) {
        return prisma.productType.findUnique({
            where: { code },
            include: {
                category: true
            }
        });
    }

    /**
     * Create a new product type
     */
    async create(data: ProductTypeCreateDto) {
        return prisma.productType.create({
            data,
            include: {
                category: true
            }
        });
    }

    /**
     * Update a product type
     */
    async update(id: string, data: ProductTypeUpdateDto) {
        return prisma.productType.update({
            where: { id },
            data,
            include: {
                category: true
            }
        });
    }

    /**
     * Delete a product type
     */
    async delete(id: string) {
        return prisma.productType.delete({
            where: { id }
        });
    }
}

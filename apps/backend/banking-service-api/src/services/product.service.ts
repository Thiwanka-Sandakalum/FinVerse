import prisma from '../config/database';
import { Prisma, Product } from '@prisma/client';
import { generateProductId } from '../utils/slugify';
import { analyzeProductFields } from '../utils/data-analysis';
import { getSavedProductIds, isProductSavedByUser } from '../utils/product-helpers';
import { AppError } from '../utils/AppError';

interface ProductFilters {
    categoryId?: string;
    institutionId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    productIds?: string[];
    page?: number;
    limit?: number;
    sort?: 'name' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
    search?: string;
}


export const getAllProducts = async (
    filters: ProductFilters,
    userId?: string,
    userInstitutionId?: string
): Promise<{
    products: (Product & { category?: any; isSaved: boolean })[];
    meta: { total: number; page: number; limit: number; pages: number };
}> => {
    const {
        categoryId,
        institutionId,
        isActive = true,
        isFeatured,
        productIds,
        page = 1,
        limit = 20,
        sort = 'createdAt',
        order = 'desc',
        search
    } = filters;

    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const where: Prisma.ProductWhereInput = {
        institutionId: userInstitutionId ?? institutionId,
        isActive,
        ...(typeof isFeatured === 'boolean' && { isFeatured }),
        ...(productIds?.length && { id: { in: productIds } })
    };

    if (categoryId) {
        where.OR = [
            { categoryId },
            { category: { parentId: categoryId } }
        ];
    }

    if (search?.trim()) {
        return prisma.$queryRaw`
          SELECT *
          FROM Product
          WHERE MATCH(name) AGAINST (${search} IN NATURAL LANGUAGE MODE)
          AND isActive = 1
          LIMIT ${take} OFFSET ${skip}
        `;
    }

    const [total, products] = await prisma.$transaction([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { [sort]: order },
            take,
            skip
        })
    ]);

    const savedIds = userId ? await getSavedProductIds(userId) : [];

    return {
        products: products.map(p => ({
            ...p,
            isSaved: savedIds.includes(p.id)
        })),
        meta: {
            total,
            page,
            limit: take,
            pages: Math.ceil(total / take)
        }
    };
};


export const getProductById = async (id: string, userId?: string): Promise<(Product & { category?: any; isSaved: boolean }) | null> => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });

    if (!product) {
        throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
    }

    return {
        ...product,
        isSaved: userId ? await isProductSavedByUser(userId, id) : false
    };
};


export const getProductsByIds = async (
    ids: string[],
    userId?: string,
    institutionId?: string
): Promise<(Product & { category?: any; isSaved: boolean })[]> => {
    if (!ids.length) return [];

    const products = await prisma.product.findMany({
        where: {
            id: { in: ids },
            isActive: true,
            ...(institutionId && { institutionId })
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    const savedIds = userId ? await getSavedProductIds(userId) : [];

    return products.map(p => ({
        ...p,
        isSaved: savedIds.includes(p.id)
    }));
};


export const createProduct = async (
    data: Partial<Product>,
    institutionId: string
): Promise<Product> => {
    if (!data.categoryId || !data.name) {
        throw new AppError(400, 'Missing required fields', 'VALIDATION_ERROR');
    }

    const categoryExists = await prisma.productCategory.findUnique({
        where: { id: data.categoryId }
    });

    if (!categoryExists) {
        throw new AppError(400, 'Invalid categoryId', 'INVALID_CATEGORY');
    }

    return prisma.product.create({
        data: {
            id: await generateProductId(data),
            institutionId,
            categoryId: data.categoryId,
            name: data.name,
            details: data.details as Prisma.InputJsonValue,
            isFeatured: data.isFeatured ?? false,
            isActive: data.isActive ?? true
        }
    });
};


export const updateProduct = async (
    id: string,
    data: Partial<Product>
): Promise<Product> => {
    return prisma.product.update({
        where: { id },
        data: {
            ...(data.categoryId && { categoryId: data.categoryId }),
            ...(data.name && { name: data.name }),
            ...(data.details && { details: data.details as Prisma.InputJsonValue }),
            ...(typeof data.isFeatured === 'boolean' && { isFeatured: data.isFeatured }),
            ...(typeof data.isActive === 'boolean' && { isActive: data.isActive })
        }
    });
};


export const deleteProduct = async (id: string): Promise<Product> => {
    return prisma.product.delete({ where: { id } });
};


export const setProductActiveStatus = async (
    id: string,
    isActive: boolean
): Promise<Product> => {
    return prisma.product.update({
        where: { id },
        data: { isActive }
    });
};


export const getProductFieldsByCategory = async (categoryId: string): Promise<any> => {
    const category = await prisma.productCategory.findUnique({
        where: { id: categoryId }
    });

    if (!category) {
        throw new AppError(404, 'Category not found', 'CATEGORY_NOT_FOUND');
    }

    const products = await prisma.product.findMany({
        where: {
            categoryId,
            details: { not: Prisma.DbNull }
        },
        select: { details: true }
    });

    return {
        category,
        fields: {
            totalProducts: products.length,
            fields: analyzeProductFields(products)
        }
    };
};

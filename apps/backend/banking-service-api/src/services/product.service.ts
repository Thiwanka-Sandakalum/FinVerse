import { NotFoundError, ValidationError } from '../utils/error-handler';
import prisma from '../config/database';
import { Prisma, Product } from '@prisma/client';
import { generateProductId } from '../utils/slugify';
import { analyzeProductFields } from '../utils/data-analysis';
import { getSavedProductIds, isProductSavedByUser, validateProductAccess } from '../utils/product-helpers';

interface ProductFilters {
    categoryId?: string;
    institutionId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
}

export const getAllProducts = async (
    filters: ProductFilters & {
        productIds?: string[];
        page?: number;
        sort?: string;
        order?: 'asc' | 'desc';
    },
    userId?: string,
    institutionId?: string
) => {
    const {
        categoryId,
        isActive,
        isFeatured,
        limit = 20,
        page = 1,
        search,
        productIds,
        sort = 'createdAt',
        order = 'desc'
    } = filters;

    // Calculate offset from page and limit
    const offset = (page - 1) * limit;

    // Build where condition
    const where: Prisma.ProductWhereInput = {};
    if (institutionId) where.institutionId = institutionId;
    if (filters.institutionId) where.institutionId = filters.institutionId;
    if (isActive !== undefined) where.isActive = isActive;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (productIds && productIds.length > 0) {
        where.id = { in: productIds };
    }

    // Build AND/OR for category and search
    const orConditions: Prisma.ProductWhereInput[] = [];
    if (categoryId) {
        orConditions.push({ categoryId: categoryId });
        orConditions.push({ category: { parentId: categoryId } });
    }
    if (search) {
        orConditions.push({ name: { contains: search } });
    }
    if (orConditions.length > 0) {
        where.OR = orConditions;
    }

    // First get total count
    const total = await prisma.product.count({ where });

    // Then get paginated data
    // Validate sort field to prevent SQL injection or invalid fields
    const allowedSortFields = ['name', 'createdAt', 'updatedAt'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt';

    const products = await prisma.product.findMany({
        where,
        include: {
            category: true
        },
        skip: offset,
        take: limit,
        orderBy: { [sortField]: order }
    });

    // If userId is provided, get saved products for this user
    const savedProductIds = userId ? await getSavedProductIds(userId) : [];

    // Add isSaved indicator to each product
    const productsWithSavedIndicator = products.map(product => ({
        ...product,
        isSaved: userId ? savedProductIds.includes(product.id) : false
    }));

    return {
        products: productsWithSavedIndicator,
        meta: {
            total,
            limit,
            page
        }
    };
};

export const getProductById = async (id: string, userId?: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
        }
    });

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    // If userId is provided, check if this product is saved by the user
    const isSaved = userId ? await isProductSavedByUser(userId, id) : false;

    return {
        ...product,
        isSaved
    };
};

export const getProductsByIds = async (ids: string[], userId?: string, userInstitutionId?: string) => {
    // Get all products with the given IDs
    const products = await prisma.product.findMany({
        where: {
            id: { in: ids },
            isActive: true
        },
        include: {
            category: true
        },
        orderBy: { createdAt: 'desc' }
    });

    // If userId is provided, get saved products for this user
    const savedProductIds = userId ? await getSavedProductIds(userId) : [];

    // Add isSaved indicator to each product
    const productsWithSavedIndicator = products.map(product => ({
        ...product,
        isSaved: userId ? savedProductIds.includes(product.id) : false
    }));

    // If user has institutionId, filter products that belong to their institution
    return userInstitutionId
        ? productsWithSavedIndicator.filter(product => product.institutionId === userInstitutionId)
        : productsWithSavedIndicator;
};

export const createProduct = async (data: Partial<Product>, userInstitutionId?: string) => {

    const {
        categoryId,
        name,
        details,
        isFeatured = false,
        isActive = true
    } = data;

    const generatedId = await generateProductId(data);

    return prisma.product.create({
        data: {
            id: generatedId,
            institutionId: userInstitutionId!,
            categoryId: categoryId!,
            name: name!,
            details: details as Prisma.InputJsonValue,
            isFeatured,
            isActive
        },
        include: {
        }
    });
};

export const updateProduct = async (id: string, data: Partial<Product>, userInstitutionId?: string) => {
    const {
        categoryId,
        name,
        details,
        isFeatured = false,
        isActive = true
    } = data;

    return prisma.product.update({
        where: { id },
        data: {
            categoryId: categoryId!,
            name: name!,
            details: details as Prisma.InputJsonValue,
            isFeatured,
            isActive
        },
        include: {
        }
    });
};

export const deleteProduct = async (id: string) => {
    return prisma.product.delete({ where: { id } });
};

export const setProductActiveStatus = async (id: string, isActive: boolean) => {
    return prisma.product.update({
        where: { id },
        data: { isActive }
    });
};

export const getProductFieldsByCategory = async (categoryId: string) => {
    // First verify the category exists
    const category = await prisma.productCategory.findUnique({
        where: { id: categoryId }
    });

    if (!category) {
        throw new NotFoundError('Product category not found');
    }

    // Get all products of this category that have details
    const products = await prisma.product.findMany({
        where: {
            categoryId: categoryId,
            details: {
                not: Prisma.DbNull
            }
        },
        select: {
            details: true
        }
    });

    // Process field information
    const fields = analyzeProductFields(products);

    return {
        category,
        fields: {
            totalProducts: products.length,
            fields
        }
    };
};

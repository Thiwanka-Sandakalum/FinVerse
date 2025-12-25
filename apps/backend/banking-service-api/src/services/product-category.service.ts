
import prisma from '../config/database';

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

export interface FieldDefinitionCreateDto {
    name: string;
    dataType: 'string' | 'number' | 'date' | 'boolean' | 'json';
    isRequired?: boolean;
    validation?: Record<string, any>;
}

export interface FieldDefinitionUpdateDto {
    name?: string;
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'json';
    isRequired?: boolean;
    validation?: Record<string, any>;
}

export async function getAllProductCategories(filters: { parentId?: string | null; level?: number } = {}) {
    const { parentId, level } = filters;
    const where: any = {};
    if (parentId !== undefined) where.parentId = parentId;
    if (level !== undefined) where.level = level;
    return prisma.productCategory.findMany({
        where,
        include: { parent: true, children: true },
        orderBy: { name: 'asc' }
    });
}

export async function getProductCategoryHierarchy() {
    return prisma.productCategory.findMany({
        where: { parentId: null },
        include: {
            children: true

        },
        orderBy: { name: 'asc' }
    });
}

export async function getProductCategoryById(id: string) {
    const category = await prisma.productCategory.findUnique({
        where: { id },
        include: { parent: true, children: true, }
    });
    if (!category) throw new Error(`Product category with ID ${id} not found`);
    return category;
}

export async function createProductCategory(data: ProductCategoryCreateDto) {
    if (data.parentId) {
        const parentExists = await prisma.productCategory.findUnique({ where: { id: data.parentId } });
        if (!parentExists) throw new Error(`Parent category with ID ${data.parentId} not found`);
        if (await wouldCreateCircularReference(data.parentId, null)) {
            throw new Error('Creating this parent-child relationship would create a circular reference');
        }
    }
    let level = 0;
    if (data.parentId) {
        const parent = await prisma.productCategory.findUnique({ where: { id: data.parentId }, select: { level: true } });
        if (parent) level = parent.level + 1;
    }
    return prisma.productCategory.create({
        data: { ...data, level },
        include: { parent: true }
    });
}

export async function updateProductCategory(id: string, data: ProductCategoryUpdateDto) {
    const category = await prisma.productCategory.findUnique({
        where: { id },
        include: { parent: true, children: true, }
    });
    if (!category) throw new Error(`Product category with ID ${id} not found`);
    if (data.parentId !== undefined) {
        if (data.parentId) {
            const parentExists = await prisma.productCategory.findUnique({ where: { id: data.parentId } });
            if (!parentExists) throw new Error(`Parent category with ID ${data.parentId} not found`);
            if (await wouldCreateCircularReference(data.parentId, id)) {
                throw new Error('Updating this parent-child relationship would create a circular reference');
            }
            if (data.parentId === id) throw new Error('A category cannot be its own parent');
        }
    }
    const updateData: any = { ...data };
    if (data.parentId !== undefined) {
        let level = 0;
        if (data.parentId) {
            const parent = await prisma.productCategory.findUnique({ where: { id: data.parentId }, select: { level: true } });
            if (parent) level = parent.level + 1;
        }
        updateData.level = level;
    }
    return prisma.productCategory.update({
        where: { id },
        data: updateData,
        include: { parent: true }
    });
}

export async function deleteProductCategory(id: string) {
    const category = await prisma.productCategory.findUnique({
        where: { id },
        include: { parent: true, children: true, }
    });
    if (!category) throw new Error(`Product category with ID ${id} not found`);
    if (category.children && category.children.length > 0) {
        throw new Error(`Cannot delete product category with ID ${id} as it has ${category.children.length} child categories`);
    }
    const productsUsingCategory = await prisma.product.count({ where: { categoryId: id } });
    if (productsUsingCategory > 0) {
        throw new Error(`Cannot delete product category with ID ${id} as it is being used by ${productsUsingCategory} products`);
    }
    const fieldDefinitions = await prisma.fieldDefinition.count({ where: { categoryId: id } });
    if (fieldDefinitions > 0) {
        throw new Error(`Cannot delete product category with ID ${id} as it has ${fieldDefinitions} field definitions`);
    }
    return prisma.productCategory.delete({ where: { id } });
}

export async function getCategoryFields(categoryId: string) {
    const category = await prisma.productCategory.findUnique({
        where: { id: categoryId },
        include: {
            parent: true,
            children: true,
        }
    });

    if (!category) throw new Error(`Product category with ID ${categoryId} not found`);

    if (category.children.length > 0) {
        return prisma.fieldDefinition.findMany({
            where: {
                OR: [
                    { categoryId },
                    { category: { parentId: categoryId } }
                ]
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        level: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
    }

    return prisma.fieldDefinition.findMany({
        where: { categoryId },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    level: true
                }
            }
        },
        orderBy: { name: 'asc' }
    });
}

export async function addCategoryField(categoryId: string, data: FieldDefinitionCreateDto) {
    const category = await prisma.productCategory.findUnique({ where: { id: categoryId } });
    if (!category) throw new Error(`Product category with ID ${categoryId} not found`);
    return prisma.fieldDefinition.create({ data: { ...data, categoryId } });
}

export async function getFieldDefinition(categoryId: string, fieldId: string) {
    const field = await prisma.fieldDefinition.findFirst({
        where: { id: fieldId }
    });
    if (!field) throw new Error(`Field definition with ID ${fieldId} not found in category ${categoryId}`);
    return field;
}

export async function updateFieldDefinition(categoryId: string, fieldId: string, data: FieldDefinitionUpdateDto) {
    const field = await prisma.fieldDefinition.findFirst({
        where: { id: fieldId }
    });
    if (!field) throw new Error(`Field definition with ID ${fieldId} not found in category ${categoryId}`);
    return prisma.fieldDefinition.update({ where: { id: fieldId }, data });
}

export async function deleteFieldDefinition(categoryId: string, fieldId: string) {
    const field = await prisma.fieldDefinition.findFirst({
        where: { id: fieldId }
    });
    if (!field) throw new Error(`Field definition with ID ${fieldId} not found in category ${categoryId}`);
    return prisma.fieldDefinition.delete({ where: { id: fieldId } });
}

async function wouldCreateCircularReference(parentId: string, childId: string | null): Promise<boolean> {
    if (childId !== null) {
        if (parentId === childId) return true;
        let currentId = parentId;
        while (currentId) {
            const current = await prisma.productCategory.findUnique({ where: { id: currentId } });
            if (!current || !current.parentId) break;
            if (current.parentId === childId) return true;
            currentId = current.parentId;
        }
    }
    return false;
}

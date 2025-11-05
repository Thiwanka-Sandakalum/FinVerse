import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from './error-handler';

const prisma = new PrismaClient();

export const getSavedProductIds = async (userId: string): Promise<string[]> => {
    const savedProducts = await prisma.savedProduct.findMany({
        where: { UserId: userId },
        select: { productId: true }
    });
    return savedProducts.map(sp => sp.productId);
};

export const isProductSavedByUser = async (userId: string, productId: string): Promise<boolean> => {
    const savedProduct = await prisma.savedProduct.findFirst({
        where: {
            UserId: userId,
            productId
        }
    });
    return !!savedProduct;
};

export const validateProductAccess = async (id: string, userInstitutionId?: string) => {
    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    if (userInstitutionId && product.institutionId !== userInstitutionId) {
        throw new ValidationError('Access denied: Product does not belong to your institution');
    }

    return product;
};
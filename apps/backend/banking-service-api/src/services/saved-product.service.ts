import prisma from '../config/database';

export const saveProduct = async (userId: string, productId: string) => {
    // Check if product exists and is active
    const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true }
    });

    if (!product) {
        throw new Error('Product not found or not active');
    }

    // Check if already saved
    const existingSave = await prisma.savedProduct.findUnique({
        where: {
            UserId_productId: {
                UserId: userId,
                productId: productId
            }
        }
    });

    if (existingSave) {
        throw new Error('Product is already saved');
    }

    // Create the saved product
    const savedProduct = await prisma.savedProduct.create({
        data: {
            UserId: userId,
            productId: productId
        },
        include: {
            product: {
                include: {
                    category: true
                }
            }
        }
    });

    return savedProduct;
};

export const unsaveProduct = async (userId: string, productId: string) => {
    // Check if the save exists
    const existingSave = await prisma.savedProduct.findUnique({
        where: {
            UserId_productId: {
                UserId: userId,
                productId: productId
            }
        }
    });

    if (!existingSave) {
        throw new Error('Product is not saved by this user');
    }

    // Delete the saved product
    await prisma.savedProduct.delete({
        where: {
            UserId_productId: {
                UserId: userId,
                productId: productId
            }
        }
    });

    return { message: 'Product unsaved successfully' };
};

export const toggleSaveProduct = async (userId: string, productId: string) => {
    // Check if product exists and is active
    const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true }
    });

    if (!product) {
        throw new Error('Product not found or not active');
    }

    // Check if already saved
    const existingSave = await prisma.savedProduct.findUnique({
        where: {
            UserId_productId: {
                UserId: userId,
                productId: productId
            }
        }
    });

    if (existingSave) {
        // Unsave the product
        await prisma.savedProduct.delete({
            where: {
                UserId_productId: {
                    UserId: userId,
                    productId: productId
                }
            }
        });
        return {
            action: 'unsaved',
            isSaved: false,
            message: 'Product unsaved successfully'
        };
    } else {
        // Save the product
        const savedProduct = await prisma.savedProduct.create({
            data: {
                UserId: userId,
                productId: productId
            }
        });
        return {
            action: 'saved',
            isSaved: true,
            message: 'Product saved successfully',
            savedProduct
        };
    }
};

export const getUserSavedProducts = async (userId: string, page: number = 1, limit: number = 20) => {
    const offset = (page - 1) * limit;

    // Get total count
    const total = await prisma.savedProduct.count({
        where: { UserId: userId }
    });

    // Get paginated saved products
    const savedProducts = await prisma.savedProduct.findMany({
        where: { UserId: userId },
        include: {
            product: {
                include: {
                    category: true
                }
            }
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
    });

    return {
        savedProducts: savedProducts.map(sp => ({
            ...sp.product,
            isSaved: true,
            savedAt: sp.createdAt
        })),
        meta: {
            total,
            limit,
            page
        }
    };
};

export const checkProductSaveStatus = async (userId: string, productId: string) => {
    const savedProduct = await prisma.savedProduct.findUnique({
        where: {
            UserId_productId: {
                UserId: userId,
                productId: productId
            }
        }
    });

    return {
        productId,
        isSaved: !!savedProduct,
        savedAt: savedProduct?.createdAt || null
    };
};
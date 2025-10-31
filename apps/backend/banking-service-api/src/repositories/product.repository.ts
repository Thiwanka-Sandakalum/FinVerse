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
    }, userId?: string) {
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
                    { categoryId: categoryId },
                    {
                        category: {
                            parent: {
                                id: categoryId
                            }
                        }
                    }
                ]
            };
        }

        // Add search filter
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { slug: { contains: search } },
                { institution: { name: { contains: search } } },
                { productType: { name: { contains: search } } },
                { tags: { some: { tag: { name: { contains: search } } } } }
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

        // If userId is provided, get saved products for this user
        let savedProductIds: string[] = [];
        if (userId) {
            const savedProducts = await prisma.savedProduct.findMany({
                where: { clerkUserId: userId },
                select: { productId: true }
            });
            savedProductIds = savedProducts.map(sp => sp.productId);
        }

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
                offset
            }
        };
    }

    /**
     * Find a product by ID
     */
    async findById(id: string, userId?: string) {
        const product = await prisma.product.findUnique({
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

        if (!product) {
            return null;
        }

        // If userId is provided, check if this product is saved by the user
        let isSaved = false;
        if (userId) {
            const savedProduct = await prisma.savedProduct.findFirst({
                where: {
                    clerkUserId: userId,
                    productId: id
                }
            });
            isSaved = !!savedProduct;
        }

        return {
            ...product,
            isSaved
        };
    }

    /**
     * Find products by array of IDs
     */
    async findByIds(ids: string[], userId?: string) {
        // Get all products with the given IDs
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: ids
                },
                isActive: true // Only return active products
            },
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
                    take: 5 // Limit rate history for batch requests
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // If userId is provided, get saved products for this user
        let savedProductIds: string[] = [];
        if (userId && products.length > 0) {
            const savedProducts = await prisma.savedProduct.findMany({
                where: {
                    clerkUserId: userId,
                    productId: {
                        in: products.map(p => p.id)
                    }
                },
                select: { productId: true }
            });
            savedProductIds = savedProducts.map(sp => sp.productId);
        }

        // Add isSaved indicator to each product
        return products.map(product => ({
            ...product,
            isSaved: userId ? savedProductIds.includes(product.id) : false
        }));
    }

    /**
     * Create a new product
     */
    async create(data: ProductCreateDto) {
        // Generate slug from name
        const slug = slugify(data.name);

        // Map customAttributes to details field for Prisma
        const { customAttributes, ...restData } = data;

        // Create product
        const product = await prisma.product.create({
            data: {
                ...restData,
                slug,
                details: customAttributes ? customAttributes as Prisma.InputJsonValue : Prisma.DbNull
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

        // Map customAttributes to details field and handle other updates
        const { customAttributes, ...restData } = data;
        const updateData: any = { ...restData };

        if (data.name) {
            updateData.slug = slugify(data.name);
        }

        if (customAttributes !== undefined) {
            updateData.details = customAttributes ? customAttributes as Prisma.InputJsonValue : Prisma.DbNull;
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

    /**
     * Find product type by ID
     */
    async findProductTypeById(id: string) {
        return prisma.productType.findUnique({
            where: { id },
            include: {
                category: true
            }
        });
    }

    /**
     * Get distinct fields and their data types from product details by product type
     */
    async getProductFieldsByType(productTypeId: string) {
        // Get all products of this type that have details
        const products = await prisma.product.findMany({
            where: {
                productTypeId: productTypeId,
                details: {
                    not: Prisma.DbNull
                }
            },
            select: {
                details: true
            }
        });

        // Extract and analyze all unique fields
        interface FieldInfo {
            key: string;
            type: string;
            examples: Set<any>;
            isRequired: boolean;
            description?: string;
        }

        const fieldMap = new Map<string, FieldInfo>();

        // Process each product's details
        for (const product of products) {
            if (product.details && typeof product.details === 'object') {
                const details = product.details as Record<string, any>;

                Object.entries(details).forEach(([key, value]) => {
                    if (!fieldMap.has(key)) {
                        fieldMap.set(key, {
                            key,
                            type: this.inferDataType(value),
                            examples: new Set(),
                            isRequired: false,
                            description: this.generateFieldDescription(key)
                        });
                    }

                    const field = fieldMap.get(key)!;

                    // Add example value (limit to prevent too much data)
                    if (field.examples.size < 5) {
                        field.examples.add(value);
                    }

                    // Check if types are consistent, if not, make it 'mixed'
                    const currentType = this.inferDataType(value);
                    if (field.type !== currentType && field.type !== 'mixed') {
                        field.type = 'mixed';
                    }
                });
            }
        }

        // Calculate field frequency to determine if required
        const totalProductsWithDetails = products.length;

        // Convert to final format
        const fields = Array.from(fieldMap.values()).map(field => ({
            key: field.key,
            type: field.type,
            examples: Array.from(field.examples).slice(0, 3), // Limit examples
            isRequired: false, // You can implement logic to determine this
            description: field.description,
            frequency: {
                count: field.examples.size,
                percentage: totalProductsWithDetails > 0 ?
                    Math.round((field.examples.size / totalProductsWithDetails) * 100) : 0
            }
        }));

        // Sort by frequency (most common first)
        fields.sort((a, b) => b.frequency.percentage - a.frequency.percentage);

        return {
            totalProducts: totalProductsWithDetails,
            fields: fields
        };
    }

    /**
     * Infer data type from value
     */
    private inferDataType(value: any): string {
        if (value === null || value === undefined) {
            return 'null';
        }

        if (typeof value === 'string') {
            // Check if it's a valid date string
            if (!isNaN(Date.parse(value))) {
                return 'date';
            }
            // Check if it's a valid number string
            if (!isNaN(Number(value))) {
                return 'number';
            }
            return 'string';
        }

        if (typeof value === 'number') {
            return Number.isInteger(value) ? 'integer' : 'decimal';
        }

        if (typeof value === 'boolean') {
            return 'boolean';
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return 'array';
            }
            // Check if all elements have the same type
            const firstType = this.inferDataType(value[0]);
            const allSameType = value.every(item => this.inferDataType(item) === firstType);
            return allSameType ? `array<${firstType}>` : 'array<mixed>';
        }

        if (typeof value === 'object') {
            return 'object';
        }

        return 'unknown';
    }

    /**
     * Generate human-readable description for common field names
     */
    private generateFieldDescription(key: string): string {
        const descriptions: Record<string, string> = {
            'interestRate': 'Interest rate percentage',
            'minimumAmount': 'Minimum amount required',
            'maximumAmount': 'Maximum amount allowed',
            'tenure': 'Tenure period',
            'tenureUnit': 'Unit for tenure (days, months, years)',
            'currency': 'Currency code (e.g., LKR, USD)',
            'features': 'List of product features',
            'penaltyRate': 'Penalty rate percentage',
            'fees': 'Associated fees',
            'requirements': 'Product requirements',
            'benefits': 'Product benefits',
            'eligibility': 'Eligibility criteria',
            'terms': 'Terms and conditions',
            'maturityAmount': 'Amount at maturity',
            'monthlyPayment': 'Monthly payment amount',
            'annualFee': 'Annual fee amount',
            'processingFee': 'Processing fee amount'
        };

        return descriptions[key] || `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    }
}

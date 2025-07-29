import prisma from '../config/database';
import slugify from '../utils/slugify';

export interface InstitutionCreateDto {
    typeId: string;
    name: string;
    logoUrl?: string;
    licenseNumber?: string;
    countryCode: string;
}

export interface InstitutionUpdateDto {
    typeId?: string;
    name?: string;
    logoUrl?: string;
    licenseNumber?: string;
    countryCode?: string;
}

export class InstitutionRepository {
    /**
     * Find all institutions with filtering options
     */
    async findAll(filters: {
        typeId?: string;
        countryCode?: string;
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }) {
        const {
            typeId,
            countryCode,
            isActive,
            limit = 20,
            offset = 0
        } = filters;

        // Build where condition
        const where: any = {};

        if (typeId) where.typeId = typeId;
        if (countryCode) where.countryCode = countryCode;
        if (isActive !== undefined) where.isActive = isActive;

        // First get total count
        const total = await prisma.institution.count({ where });

        // Then get paginated data
        const institutions = await prisma.institution.findMany({
            where,
            include: {
                type: true
            },
            skip: offset,
            take: limit,
            orderBy: { name: 'asc' }
        });

        return {
            institutions,
            meta: {
                total,
                limit,
                offset
            }
        };
    }

    /**
     * Find an institution by ID
     */
    async findById(id: string) {
        return prisma.institution.findUnique({
            where: { id },
            include: {
                type: true,
                products: {
                    where: { isActive: true },
                    take: 10
                }
            }
        });
    }

    /**
     * Create a new institution
     */
    async create(data: InstitutionCreateDto) {
        // Generate slug from name
        const slug = slugify(data.name);

        // Create institution
        return prisma.institution.create({
            data: {
                ...data,
                slug
            },
            include: {
                type: true
            }
        });
    }

    /**
     * Update an institution
     */
    async update(id: string, data: InstitutionUpdateDto) {
        // Update with optional slug if name changes
        const updateData: any = { ...data };
        if (data.name) {
            updateData.slug = slugify(data.name);
        }

        // Update the institution
        return prisma.institution.update({
            where: { id },
            data: updateData,
            include: {
                type: true
            }
        });
    }

    /**
     * Delete an institution
     */
    async delete(id: string) {
        return prisma.institution.delete({
            where: { id }
        });
    }

    /**
     * Activate or deactivate an institution
     */
    async setActiveStatus(id: string, isActive: boolean) {
        return prisma.institution.update({
            where: { id },
            data: { isActive }
        });
    }
}

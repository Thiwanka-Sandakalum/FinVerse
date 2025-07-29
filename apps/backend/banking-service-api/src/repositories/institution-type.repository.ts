import prisma from '../config/database';

export interface InstitutionTypeCreateDto {
    code: string;
    name: string;
    description?: string;
}

export interface InstitutionTypeUpdateDto {
    name?: string;
    description?: string;
}

export class InstitutionTypeRepository {
    /**
     * Find all institution types
     */
    async findAll() {
        return prisma.institutionType.findMany({
            orderBy: { name: 'asc' }
        });
    }

    /**
     * Find an institution type by ID
     */
    async findById(id: string) {
        return prisma.institutionType.findUnique({
            where: { id },
            include: {
                institutions: {
                    where: { isActive: true }
                }
            }
        });
    }

    /**
     * Find an institution type by code
     */
    async findByCode(code: string) {
        return prisma.institutionType.findUnique({
            where: { code }
        });
    }

    /**
     * Create a new institution type
     */
    async create(data: InstitutionTypeCreateDto) {
        return prisma.institutionType.create({
            data
        });
    }

    /**
     * Update an institution type
     */
    async update(id: string, data: InstitutionTypeUpdateDto) {
        return prisma.institutionType.update({
            where: { id },
            data
        });
    }

    /**
     * Delete an institution type
     */
    async delete(id: string) {
        return prisma.institutionType.delete({
            where: { id }
        });
    }
}

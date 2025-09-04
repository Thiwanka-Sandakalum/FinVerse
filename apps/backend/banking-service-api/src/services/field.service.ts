import { PrismaClient, FieldDefinition, Prisma } from '@prisma/client';
import { NotFoundError } from '../utils/error-handler';

const prisma = new PrismaClient();

type FieldCreateInput = Prisma.FieldDefinitionCreateInput;
type FieldUpdateInput = Prisma.FieldDefinitionUpdateInput;

export class FieldService {
    /**
     * Get all field definitions
     */
    async getAllFields(): Promise<FieldDefinition[]> {
        return prisma.fieldDefinition.findMany();
    }

    /**
     * Get field definitions by category ID
     */
    async getFieldsByCategoryId(categoryId: string): Promise<FieldDefinition[]> {
        const fields = await prisma.fieldDefinition.findMany({
            where: {
                categoryId
            }
        });

        if (!fields.length) {
            throw new NotFoundError(`No fields found for category ${categoryId}`);
        }

        return fields;
    }

    /**
     * Get field definition by ID
     */
    async getFieldById(id: string): Promise<FieldDefinition> {
        const field = await prisma.fieldDefinition.findUnique({
            where: { id }
        });

        if (!field) {
            throw new NotFoundError(`Field not found with id ${id}`);
        }

        return field;
    }

    /**
     * Create a new field definition
     */
    async createField(data: FieldCreateInput): Promise<FieldDefinition> {
        return prisma.fieldDefinition.create({
            data
        });
    }

    /**
     * Update a field definition
     */
    async updateField(id: string, data: FieldUpdateInput): Promise<FieldDefinition> {
        const field = await prisma.fieldDefinition.findUnique({
            where: { id }
        });

        if (!field) {
            throw new NotFoundError(`Field not found with id ${id}`);
        }

        return prisma.fieldDefinition.update({
            where: { id },
            data
        });
    }

    /**
     * Delete a field definition
     */
    async deleteField(id: string): Promise<FieldDefinition> {
        const field = await prisma.fieldDefinition.findUnique({
            where: { id }
        });

        if (!field) {
            throw new NotFoundError(`Field not found with id ${id}`);
        }

        return prisma.fieldDefinition.delete({
            where: { id }
        });
    }
}

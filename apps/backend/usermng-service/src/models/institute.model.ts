import prisma from './prisma';

// Institute model for usermng-service
// This is a placeholder. Replace with actual ORM/DB logic as needed.

export interface Institute {
    id: string;
    name: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}

// Example: Replace with actual DB call (e.g., using Prisma Client or another ORM)
export async function createInstitute({ id, name, metadata }: { id: string; name: string; metadata?: any }): Promise<Institute> {
    const institute = await prisma.institute.create({
        data: {
            id,
            name,
            metadata,
        },
    });
    return institute;
}

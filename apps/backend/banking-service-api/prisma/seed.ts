import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed operation from data.json...');
    const seedPath = path.join(__dirname, 'data.json');
    const raw = fs.readFileSync(seedPath, 'utf8');
    const data = JSON.parse(raw);

    console.log('Deleting all data...');
    await prisma.savedProduct.deleteMany();
    await prisma.product.deleteMany();
    await prisma.fieldDefinition.deleteMany();
    await prisma.productCategory.deleteMany();

    if (Array.isArray(data.categories)) {
        for (const cat of data.categories) {
            const { id, parentId, name, description, level } = cat;
            if (!name) {
                console.warn(`Skipping category with missing name:`, cat);
                continue;
            }
            await prisma.productCategory.create({
                data: { id: id || randomUUID(), parentId, name, description, level },
            });
        }
        console.log(`Seeded ${data.categories.length} product categories.`);
    }

    if (Array.isArray(data.fieldDefinitions)) {
        for (const field of data.fieldDefinitions) {
            try {
                const { id, categoryId, name, dataType, isRequired, validation } = field;
                await prisma.fieldDefinition.create({
                    data: {
                        id: id || randomUUID(),
                        categoryId,
                        name,
                        dataType,
                        isRequired,
                        validation: validation || null
                    }
                });
            } catch (error) {
                console.warn(`Failed to create field definition: ${field.name}`, error);
            }
        }
        console.log(`Successfully processed ${data.fieldDefinitions.length} field definitions`);
    }

    if (Array.isArray(data.products)) {
        for (const prod of data.products) {
            const {
                id,
                institutionId,
                name,
                details,
                isFeatured,
                isActive,
                categoryId,
                createdAt,
                updatedAt
            } = prod;
            await prisma.product.create({
                data: {
                    id: id || randomUUID(),
                    institutionId,
                    name,
                    details,
                    isFeatured,
                    isActive,
                    categoryId,
                    createdAt: createdAt ? new Date(createdAt) : undefined,
                    updatedAt: updatedAt ? new Date(updatedAt) : undefined
                },
            });
        }
        console.log(`Seeded ${data.products.length} products.`);
    }

    console.log('Seed completed from data.json');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

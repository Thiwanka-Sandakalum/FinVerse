import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed operation from seed.json...');
    const seedPath = path.join(__dirname, 'seed.json');
    const raw = fs.readFileSync(seedPath, 'utf-8');
    const data = JSON.parse(raw);

    // Institution Types
    if (Array.isArray(data.institutionTypes)) {
        for (const type of data.institutionTypes) {
            await prisma.institutionType.upsert({
                where: { id: type.id },
                update: type,
                create: type,
            });
        }
    }

    // Institutions
    if (Array.isArray(data.institutions)) {
        for (const inst of data.institutions) {
            await prisma.institution.upsert({
                where: { id: inst.id },
                update: inst,
                create: inst,
            });
        }
    }

    // Product Categories
    if (Array.isArray(data.productCategories)) {
        // Handle nested array structure
        const categories = Array.isArray(data.productCategories[0])
            ? data.productCategories[0]
            : data.productCategories;

        for (const cat of categories) {
            if (!cat.id || !cat.slug) {
                console.warn(`Skipping category with missing id or slug:`, cat);
                continue;
            }

            await prisma.productCategory.upsert({
                where: { id: cat.id },
                update: {
                    name: cat.name,
                    slug: cat.slug,
                    description: cat.description,
                    level: cat.level || 0,
                    parentId: cat.parentId
                },
                create: {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    description: cat.description,
                    level: cat.level || 0,
                    parentId: cat.parentId
                }
            });
        }
    }

    // Field Definitions
    if (Array.isArray(data.fieldDefinitions)) {
        // First, delete all existing field definitions
        await prisma.fieldDefinition.deleteMany({});

        // Then create the new ones
        for (const field of data.fieldDefinitions) {
            const { description, ...fieldData } = field; // Remove description field
            try {
                await prisma.fieldDefinition.create({
                    data: {
                        id: field.id,
                        categoryId: field.categoryId,
                        name: field.name,
                        slug: field.slug,
                        dataType: field.dataType,
                        isRequired: field.isRequired,
                        options: field.options || [],
                        validation: field.validation || null
                    }
                });
            } catch (error) {
                console.warn(`Failed to create field definition: ${field.name}`, error);
            }
        }
        console.log(`Successfully created ${data.fieldDefinitions.length} field definitions`);
    }

    // Product Types
    if (Array.isArray(data.productTypes)) {
        for (const type of data.productTypes) {
            await prisma.productType.upsert({
                where: { code: type.code },
                update: type,
                create: type,
            });
        }
    }

    // Product Tags
    if (Array.isArray(data.productTags)) {
        for (const tag of data.productTags) {
            await prisma.productTag.upsert({
                where: { id: tag.id },
                update: tag,
                create: tag,
            });
        }
    }

    // Products
    if (Array.isArray(data.products)) {
        for (const prod of data.products) {
            await prisma.product.upsert({
                where: { id: prod.id },
                update: prod,
                create: prod,
            });
        }
    }

    console.log('Seed completed from seed.json');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

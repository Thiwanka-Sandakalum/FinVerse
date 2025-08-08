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
        for (const cat of data.productCategories) {
            await prisma.productCategory.upsert({
                where: { slug: cat.slug },
                update: cat,
                create: cat,
            });
        }
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

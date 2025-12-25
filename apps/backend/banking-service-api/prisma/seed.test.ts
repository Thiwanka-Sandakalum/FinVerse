import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();

  // Seed categories
  const cat1 = await prisma.productCategory.create({
    data: { id: 'cat1', name: 'Category 1', level: 1 }
  });
  const cat2 = await prisma.productCategory.create({
    data: { id: 'cat2', name: 'Category 2', level: 1 }
  });

  // Seed products
  await prisma.product.create({
    data: {
      id: 'prod1',
      name: 'Test Product 1',
      description: 'A test product',
      categoryId: cat1.id,
      institutionId: 'inst1',
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  await prisma.product.create({
    data: {
      id: 'prod2',
      name: 'Test Product 2',
      description: 'Another test product',
      categoryId: cat2.id,
      institutionId: 'inst2',
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

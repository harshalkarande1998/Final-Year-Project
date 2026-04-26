const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { category: { storeType: 'GROCERY' } },
    include: { category: true }
  });

  console.log(`Checking ${products.length} products...`);
  products.forEach(p => {
    if (!p.image || p.image === '/uploads/landing_grocery_banner.png') {
      console.log(`[FAILED] ${p.name} (Cat: ${p.category.name}) - Image: ${p.image}`);
    } else {
      console.log(`[OK] ${p.name} (Cat: ${p.category.name}) - Image: ${p.image}`);
    }
  });
}

main().finally(() => prisma.$disconnect());

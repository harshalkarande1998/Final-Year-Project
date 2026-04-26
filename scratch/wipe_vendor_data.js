const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Starting total database cleanup for vendor data...')

  // 1. Delete Orders (they have foreign keys to Products and VendorProfiles)
  const deletedOrders = await prisma.order.deleteMany({})
  console.log(`Deleted ${deletedOrders.count} orders.`)

  // 2. Delete CartItems
  const deletedCartItems = await prisma.cartItem.deleteMany({})
  console.log(`Deleted ${deletedCartItems.count} cart items.`)

  // 3. Delete Products
  const deletedProducts = await prisma.product.deleteMany({})
  console.log(`Deleted ${deletedProducts.count} products.`)

  // 4. Delete VendorProfiles
  const deletedProfiles = await prisma.vendorProfile.deleteMany({})
  console.log(`Deleted ${deletedProfiles.count} vendor profiles.`)

  // 5. Delete Users with role 'vendor'
  const deletedUsers = await prisma.user.deleteMany({
    where: { role: 'vendor' }
  })
  console.log(`Deleted ${deletedUsers.count} vendor user accounts.`)

  console.log('Cleanup complete! The database is now ready for real-time customer data.')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

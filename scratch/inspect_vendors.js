const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const vendors = await prisma.vendorProfile.findMany({
    include: {
      user: true
    }
  })

  console.log('Total Vendors:', vendors.length)
  vendors.forEach(v => {
    console.log(`Vendor: ${v.shopName} (ID: ${v.id}) -> User: ${v.user?.email || 'ORPHANED'}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

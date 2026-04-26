const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const vendors = await prisma.vendorProfile.findMany({
    include: {
      user: true
    }
  })

  const invalid = vendors.filter(v => v.user.role !== 'vendor')

  if (invalid.length === 0) {
    console.log('No vendor profiles found linked to non-vendor users.')
  } else {
    console.log(`Found ${invalid.length} profiles linked to non-vendor users. Deleting...`)
    for (const v of invalid) {
      await prisma.vendorProfile.delete({ where: { id: v.id } })
      console.log(`Deleted profile: ${v.shopName} (ID: ${v.id}) - User Role: ${v.user.role}`)
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

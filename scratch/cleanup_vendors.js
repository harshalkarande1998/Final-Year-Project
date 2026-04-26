const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Find all vendor profiles
  const profiles = await prisma.vendorProfile.findMany()
  const users = await prisma.user.findMany()
  const userIds = new Set(users.map(u => u.id))

  const orphans = profiles.filter(p => !userIds.has(p.userId))

  if (orphans.length === 0) {
    console.log('No orphaned vendor profiles found.')
  } else {
    console.log(`Found ${orphans.length} orphaned profiles. Deleting...`)
    for (const orphan of orphans) {
      await prisma.vendorProfile.delete({ where: { id: orphan.id } })
      console.log(`Deleted orphaned profile: ${orphan.shopName} (ID: ${orphan.id})`)
    }
  }

  // Also check for User with role 'vendor' but NO vendor profiles (maybe the user meant this too?)
  const vendorUsers = users.filter(u => u.role === 'vendor')
  for (const vu of vendorUsers) {
    const profileCount = await prisma.vendorProfile.count({ where: { userId: vu.id } })
    if (profileCount === 0) {
      console.log(`User ${vu.email} has role 'vendor' but NO profiles.`)
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

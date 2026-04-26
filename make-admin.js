const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('Please provide an email address. Usage: node make-admin.js <email>')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    })
    console.log(`Successfully updated ${user.email} to role: ADMIN`)
  } catch (error) {
    console.error(`Failed to update user. Does ${email} exist in the database?`)
  } finally {
    await prisma.$disconnect()
  }
}

main()

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding high-quality restaurant data...')

  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create a "Real" Vendor User
  const user = await prisma.user.upsert({
    where: { email: 'vendor@gmail.com' },
    update: {},
    create: {
      email: 'vendor@gmail.com',
      name: 'Harshal Karande',
      password: passwordHash,
      role: 'vendor'
    }
  })

  // 2. Add realistic restaurants for this user
  const restaurants = [
    {
      shopName: "The Gourmet Bistro",
      storeType: 'RESTAURANT',
      address: "MG Road, Camp, Pune",
      phone: "9876543210",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
    },
    {
      shopName: "Spice Symphony",
      storeType: 'RESTAURANT',
      address: "FC Road, Shivajinagar, Pune",
      phone: "9876543211",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80"
    },
    {
      shopName: "Urban Plate",
      storeType: 'RESTAURANT',
      address: "Koregaon Park, Lane 7, Pune",
      phone: "9876543212",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
    },
    {
      shopName: "Classic Crust Pizza",
      storeType: 'RESTAURANT',
      address: "Aundh, Near IT Park, Pune",
      phone: "9876543213",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
    }
  ]

  for (const r of restaurants) {
    await prisma.vendorProfile.create({
      data: {
        ...r,
        userId: user.id
      }
    })
  }

  console.log('Seeding complete! 4 high-quality restaurants added to vendor@gmail.com')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

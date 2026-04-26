import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req) {
  try {
    const { name, email, password, role, shopName, storeType } = await req.json()

    if (!email || !password) {
      return new Response('Email and password required', { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new Response('User already exists', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === 'vendor' ? 'vendor' : 'customer'
      }
    })

    if (role === 'vendor' && shopName) {
      await prisma.vendorProfile.create({
        data: {
          userId: user.id,
          shopName,
          storeType: storeType || 'GROCERY'
        }
      })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error creating user', { status: 500 })
  }
}

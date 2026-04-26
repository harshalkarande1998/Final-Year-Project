import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const data = await req.json()
    
    // Get user cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true }
    })

    if (cartItems.length === 0) {
      return new Response('Cart is empty', { status: 400 })
    }

    // Create orders for each item
    for (const item of cartItems) {
      await prisma.order.create({
        data: {
          customerId: session.user.id,
          productId: item.productId,
          vendorId: item.product.vendorId,
          quantity: item.quantity,
          fullName: data.fullName,
          phone: data.phone,
          addressLine: data.addressLine,
          city: data.city,
          pincode: data.pincode,
          notes: data.notes
        }
      })
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id }
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error processing checkout', { status: 500 })
  }
}

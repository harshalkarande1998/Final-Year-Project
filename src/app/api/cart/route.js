import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { productId, quantity } = await req.json()

    // Find the product being added
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) return new Response('Product not found', { status: 404 })

    // Check existing cart items for this user
    const userCartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true }
    })

    if (userCartItems.length > 0) {
      const existingVendorId = userCartItems[0].product.vendorId
      if (existingVendorId !== product.vendorId) {
        return new Response('You can only order from one store at a time. Please clear your cart to add items from this store.', { status: 409 })
      }
    }

    // Find existing item
    const existing = userCartItems.find(item => item.productId === productId)

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity
        }
      })
    }

    return new Response('Added to cart', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error adding to cart', { status: 500 })
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const productId = searchParams.get('productId')

    if (id) {
      await prisma.cartItem.delete({
        where: {
          id,
          userId: session.user.id
        }
      })
    } else if (productId) {
      await prisma.cartItem.deleteMany({
        where: {
          productId,
          userId: session.user.id
        }
      })
    }

    return new Response('Deleted', { status: 200 })
  } catch (error) {
    return new Response('Error deleting item', { status: 500 })
  }
}

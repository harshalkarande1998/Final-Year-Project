import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { 
        product: {
          include: { vendor: true }
        } 
      }
    })
    return Response.json(items)
  } catch (error) {
    return new Response('Error', { status: 500 })
  }
}

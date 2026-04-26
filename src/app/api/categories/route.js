import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const storeType = searchParams.get('storeType')

    const categories = await prisma.category.findMany({
      where: storeType ? { storeType } : undefined,
      orderBy: { order: 'asc' }
    })
    return new Response(JSON.stringify(categories), { status: 200 })
  } catch (error) {
    return new Response('Error fetching categories', { status: 500 })
  }
}

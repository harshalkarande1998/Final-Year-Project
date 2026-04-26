import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    // 1. Search Vendors (Restaurants & Grocery Stores)
    const vendors = await prisma.vendorProfile.findMany({
      where: {
        OR: [
          { shopName: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    })

    // 2. Search Products (Dishes & Groceries)
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        vendor: true
      },
      take: 10
    })

    // Format results
    const results = [
      ...vendors.map(v => ({
        id: v.id,
        name: v.shopName,
        type: v.storeType === 'RESTAURANT' ? 'RESTAURANT' : 'STORE',
        subtitle: v.address || 'Local Shop',
        image: v.image,
        link: v.storeType === 'RESTAURANT' ? `/food/restaurant/${v.id}` : `/instamart/store/${v.id}`
      })),
      ...products.map(p => ({
        id: p.id,
        name: p.name,
        type: p.vendor.storeType === 'RESTAURANT' ? 'DISH' : 'GROCERY',
        subtitle: `at ${p.vendor.shopName}`,
        image: p.image,
        link: p.vendor.storeType === 'RESTAURANT' ? `/food/restaurant/${p.vendor.id}` : `/instamart/store/${p.vendor.id}`
      }))
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

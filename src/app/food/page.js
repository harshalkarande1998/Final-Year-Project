import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FoodFilterClient from './FoodFilterClient'

export default async function FoodPage() {
  const restaurants = await prisma.vendorProfile.findMany({
    where: { storeType: 'RESTAURANT' },
    include: {
      _count: { select: { products: true } }
    }
  })

  const categories = await prisma.category.findMany({
    where: { storeType: 'RESTAURANT' },
    orderBy: { order: 'asc' }
  })

  return (
    <div className="min-h-screen bg-white font-sans text-swiggy-dark selection:bg-swiggy-orange selection:text-white">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Categories Carousel */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[24px] font-black tracking-tight text-[#02060cE6]">What&apos;s on your mind?</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {categories.map(cat => (
              <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer group min-w-[144px] snap-start">
                <div className="w-[144px] h-[144px] rounded-full overflow-hidden relative transition-transform duration-300">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white" style={{ backgroundColor: cat.color }}>{cat.name[0]}</div>
                  )}
                </div>
                {/* Swiggy doesn't typically show category names under these images, but we'll keep it subtle */}
                <span className="font-medium text-[#02060c99] text-sm text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#f0f0f5] my-8 border-[1.5px]" />

        <FoodFilterClient initialRestaurants={restaurants} />
      </div>

    </div>
  )
}

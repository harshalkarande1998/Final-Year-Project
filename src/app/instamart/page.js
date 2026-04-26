import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Store } from 'lucide-react'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import CartBar from '@/components/CartBar'
import SafeImage from '@/components/SafeImage'
import FloatingHelpBot from '@/components/FloatingHelpBot'
import InstamartSearch from './InstamartSearch'
import './instamart.css'

export default async function InstamartPage({ searchParams }) {
  const resolvedParams = await searchParams
  const query = resolvedParams?.q || ''
  const categoryFilter = resolvedParams?.category || ''

  const categories = await prisma.category.findMany({
    where: { storeType: 'GROCERY' },
    orderBy: { order: 'asc' }
  })

  const products = await prisma.product.findMany({
    where: {
      vendor: { storeType: 'GROCERY' },
      name: { contains: query },
      ...(categoryFilter ? { category: { slug: categoryFilter } } : {})
    },
    include: { vendor: true, category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <>
      <div className="min-h-screen bg-[#f1f1f6] font-sans text-[#282c3f]">
        {/* Instamart Header */}
        <div className="bg-gradient-to-r from-[#5f2568] to-[#99226d] pt-6 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-2xl font-black text-white hover:opacity-80 transition-opacity">
                LocalSwig
              </Link>
              <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                 Back to Home
              </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-white">
                <h1 className="text-4xl font-black mb-2 tracking-tight">Instamart</h1>
                <p className="text-[#f7d4bb] font-bold text-lg">Groceries delivered in minutes</p>
              </div>
              <InstamartSearch />
            </div>
          </div>
        </div>

        <div className="flex max-w-7xl mx-auto py-8">
          {/* Categories Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block pr-8 border-r border-[#e2e8f0]">
            <h2 className="text-[11px] font-black text-[#93959f] uppercase tracking-widest mb-6 px-4">Categories</h2>
            <div className="space-y-1">
              <Link 
                href="/instamart" 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${!categoryFilter ? 'bg-white shadow-sm text-[#99226d]' : 'text-[#686b78] hover:bg-white hover:shadow-sm'}`}
              >
                All Groceries
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/instamart?category=${cat.slug}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${categoryFilter === cat.slug ? 'bg-white shadow-sm text-[#99226d]' : 'text-[#686b78] hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    {cat.image ? (
                       <Image src={cat.image} alt={cat.name} width={32} height={32} className="object-cover w-full h-full" />
                    ) : (
                       <div className="w-full h-full" style={{ backgroundColor: cat.color }}></div>
                    )}
                  </div>
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 px-8">
            <h2 className="text-2xl font-extrabold text-[#282c3f] mb-8">
              {categoryFilter ? categories.find(c => c.slug === categoryFilter)?.name : 'Fresh Groceries'}
            </h2>
            
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[32px] shadow-sm border border-[#e2e8f0]">
                <h3 className="text-xl font-bold text-[#282c3f]">No items found</h3>
                <p className="text-[#686b78]">Try selecting a different category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map(product => (
                  <div key={product.id} className="instamart-card group">
                    <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 shadow-sm border border-[#f1f1f6] group-hover:shadow-xl transition-all duration-300">
                      <SafeImage 
                        src={product.image} 
                        alt={product.name} 
                        className="group-hover:scale-105" 
                      />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                         <span className="text-[10px] font-black text-[#60b246]">10 MINS</span>
                      </div>
                    </div>
                    
                    <div className="px-1">
                      <h3 className="text-[15px] font-extrabold text-[#282c3f] line-clamp-1 leading-tight mb-0.5">{product.name}</h3>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Store size={12} className="text-[#93959f]" />
                        <span className="text-[11px] font-bold text-[#686b78] truncate">{product.vendor.shopName}</span>
                      </div>
                      <p className="text-[10px] font-black text-[#93959f] uppercase tracking-wider mb-3">1 unit</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-[#02060c]">₹{product.price.toFixed(0)}</span>
                        <AddToCartButton productId={product.id} variant="instamart" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <CartBar />
      <FloatingHelpBot />
    </>
  )
}

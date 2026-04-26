import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import VendorDashboardClient from './VendorDashboardClient'
import './vendor.css'

export default async function VendorHubPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  if (session.user.role !== 'vendor') {
    return (
      <div className="min-h-screen bg-[#f0f0f5] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
          <h2 className="text-2xl font-black text-[#02060c] mb-2">Access Denied</h2>
          <p className="text-[#02060c99]">Only vendor partners can access this portal.</p>
        </div>
      </div>
    )
  }

  const vendorProfiles = await prisma.vendorProfile.findMany({
    where: { userId: session.user.id },
    orderBy: { shopName: 'asc' },
    include: {
      _count: {
        select: { products: true, orders: true }
      },
      orders: {
        include: { product: true }
      }
    }
  })

  // Calculate high-level analytics
  const totalRevenue = vendorProfiles.reduce((sum, p) => 
    sum + p.orders.reduce((oSum, o) => oSum + (o.product.price * o.quantity), 0), 0
  )
  const totalOrders = vendorProfiles.reduce((sum, p) => sum + p._count.orders, 0)
  const totalProducts = vendorProfiles.reduce((sum, p) => sum + p._count.products, 0)

  return (
    <div className="min-h-screen bg-[#f0f0f5] font-sans selection:bg-swiggy-orange selection:text-white pb-24">
      {/* Premium Hub Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#02060c] tracking-tight">Partner Hub</h1>
            <p className="text-[#02060c99] font-medium mt-1">Manage all your stores and restaurants in one place.</p>
          </div>
          {/* We pass the client component here to handle the Add Restaurant Modal */}
          <VendorDashboardClient defaultType={vendorProfiles.length > 0 ? vendorProfiles[0].storeType : 'RESTAURANT'} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-8">
        {vendorProfiles.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-swiggy-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h2 className="text-2xl font-extrabold text-[#02060c] mb-2">No Stores Found</h2>
            <p className="text-[#02060c99] max-w-md mx-auto mb-8 font-medium">You haven&apos;t added any restaurants or grocery stores yet. Add your first store to start selling.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorProfiles.map(profile => (
              <Link key={profile.id} href={`/vendor/restaurant/${profile.id}`} className="group block">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                  
                  <div className="h-40 relative bg-gray-100 overflow-hidden">
                    <Image 
                      src={profile.image || (profile.storeType === 'RESTAURANT' ? '/uploads/restaurant_banner.png' : '/uploads/grocery_veg.png')} 
                      alt={profile.shopName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-md ${profile.storeType === 'RESTAURANT' ? 'bg-orange-500/80' : 'bg-pink-500/80'}`}>
                        {profile.storeType}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-extrabold text-[#02060c] mb-1 truncate">{profile.shopName}</h3>
                    <p className="text-[#02060c99] text-sm mb-4 truncate">{profile.address || 'Address not provided'}</p>
                    
                    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs font-bold text-[#02060c99] uppercase tracking-wider mb-1">Items</p>
                        <p className="text-lg font-black text-[#02060c]">{profile._count.products}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#02060c99] uppercase tracking-wider mb-1">Orders</p>
                        <p className="text-lg font-black text-swiggy-orange">{profile._count.orders}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

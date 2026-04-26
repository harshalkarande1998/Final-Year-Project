import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import Link from 'next/link'
import Image from 'next/image'
import HomeClientWrapper from './HomeClientWrapper'

export default async function MegaAppHomePage() {
  const session = await getServerSession(authOptions)
  
  // Fetch actual restaurants from the database
  const restaurants = await prisma.vendorProfile.findMany({
    where: { storeType: 'RESTAURANT' },
    take: 8,
    include: {
      _count: { select: { products: true } }
    }
  })

  // Mock metadata for visual appeal (similar to FoodPage)
  const getRestaurantMeta = (restaurant) => {
    const idNum = parseInt(restaurant.id.slice(-4), 16) || 0
    return {
      rating: 3.8 + (idNum % 12) / 10,
      mins: 15 + (idNum % 45)
    }
  }
  // Categories for "What's on your mind?"
  const categories = [
    { name: 'Biryani', image: '/uploads/food_desserts.png', slug: 'indian' },
    { name: 'Pizzas', image: '/uploads/pizza_icon.png', slug: 'pizzas' },
    { name: 'Burgers', image: '/uploads/burger_icon.png', slug: 'burgers' },
    { name: 'Desserts', image: '/uploads/food_desserts.png', slug: 'desserts' },
    { name: 'Dairy', image: '/uploads/grocery_dairy.png', slug: 'dairy' },
    { name: 'Vegetables', image: '/uploads/grocery_veg.png', slug: 'vegetables' },
    { name: 'Fruits', image: '/uploads/grocery_fruits.png', slug: 'fruits' },
  ]

  return (
    <div className="min-h-screen bg-[#f0f0f5] font-sans text-swiggy-dark selection:bg-swiggy-orange selection:text-white">
      
      <HomeClientWrapper session={session}>
        <main className="max-w-[1200px] mx-auto px-4 mt-8 pb-24">
          
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-[#02060c] tracking-tight mb-1">
                Hi {session?.user?.name ? `, ${session.user.name.split(' ')[0]}!` : 'there! 👋'}
              </h1>
              <p className="text-[#02060c99] font-bold text-lg">What are you looking for today?</p>
            </div>
          </div>

          {/* Primary Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/food" className="group relative overflow-hidden rounded-[32px] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full flex flex-col p-8 z-10">
                <h2 className="text-3xl font-black tracking-tight text-[#02060c] mb-2">Food Delivery</h2>
                <p className="text-orange-600 font-black text-lg mb-auto">UPTO 60% OFF</p>
                <div className="flex items-center gap-2 text-white bg-swiggy-orange w-max px-6 py-3 rounded-full font-black transition-all shadow-md group-hover:bg-[#e06b0d]">
                  Order Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-[240px] h-[240px] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                <Image src="/uploads/burger_icon.png" alt="Food" fill className="object-cover rounded-tl-[120px]" />
              </div>
            </Link>

            <Link href="/instamart" className="group relative overflow-hidden rounded-[32px] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50 to-pink-100 opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full flex flex-col p-8 z-10">
                <h2 className="text-3xl font-black tracking-tight text-[#02060c] mb-2">Instamart</h2>
                <p className="text-pink-600 font-black text-lg mb-auto">FREE DELIVERY</p>
                <div className="flex items-center gap-2 text-white bg-[#99226d] w-max px-6 py-3 rounded-full font-black transition-all shadow-md group-hover:bg-[#7a1b57]">
                  Shop Groceries
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-[240px] h-[240px] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                <Image src="/uploads/grocery_veg.png" alt="Groceries" fill className="object-cover rounded-tl-[120px]" />
              </div>
            </Link>
          </div>

          {/* Secondary Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <Link href="/food" className="group relative overflow-hidden rounded-[24px] bg-white shadow-sm hover:shadow-md transition-all h-[160px] cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent"></div>
              <div className="relative p-5">
                <h3 className="text-xl font-bold text-[#02060c] mb-1">Dineout</h3>
                <p className="text-sm font-black text-blue-600">UPTO 50% OFF</p>
              </div>
              <div className="absolute right-0 bottom-0 w-[100px] h-[100px] transition-all group-hover:scale-110">
                <Image src="/uploads/pizza_icon.png" alt="Dineout" fill className="object-cover rounded-tl-[40px]" />
              </div>
            </Link>

            <Link href="/genie" className="group relative overflow-hidden rounded-[24px] bg-white shadow-sm hover:shadow-md transition-all h-[160px] cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-b from-teal-50 to-transparent"></div>
              <div className="relative p-5">
                <h3 className="text-xl font-bold text-[#02060c] mb-1">Genie</h3>
                <p className="text-sm font-black text-teal-600">SEND PACKAGES</p>
              </div>
              <div className="absolute right-0 bottom-0 w-[100px] h-[100px] bg-teal-100 rounded-tl-full flex items-center justify-center text-3xl group-hover:bg-teal-200 transition-colors">
                📦
              </div>
            </Link>

            <Link href="/membership" className="col-span-2 relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#282c3f] to-[#3d4152] text-white shadow-sm flex items-center p-6 h-[140px] md:h-[160px] cursor-pointer hover:shadow-lg transition-shadow">
              <div className="z-10 max-w-[70%] md:max-w-[60%]">
                <div className="text-[10px] font-bold tracking-[2px] text-gray-400 mb-1 uppercase">LocalSwig One</div>
                <h3 className="text-xl md:text-2xl font-black mb-2">Get Free Delivery</h3>
                <p className="text-[11px] md:text-xs font-bold text-gray-300">Save up to ₹500 every month with unlimited benefits</p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] w-[140px] h-[140px] md:w-[180px] md:h-[180px] opacity-20 rotate-12">
                <Image src="/uploads/burger_icon.png" alt="Free Delivery" fill className="object-cover grayscale" />
              </div>
            </Link>
          </div>

          {/* What's on your mind? */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#02060c] tracking-tight">What&apos;s on your mind?</h2>
            </div>
            <div className="flex overflow-x-auto pb-4 gap-4 md:gap-8 no-scrollbar scroll-smooth">
              {categories.map((cat, i) => (
                <Link 
                  href={`/food?category=${cat.slug}`}
                  key={i} 
                  className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-20 h-20 md:w-[144px] md:h-[144px] relative overflow-hidden rounded-full hover:scale-105 transition-transform duration-300">
                    <Image 
                      src={cat.image} 
                      alt={cat.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-[#3d4152] group-hover:text-swiggy-orange transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Actual Restaurants from DB */}
          {restaurants.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-black text-[#02060c] tracking-tight mb-6">Top brands for you</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {restaurants.map((restaurant) => {
                  const meta = getRestaurantMeta(restaurant)
                  return (
                    <Link href={`/food/restaurant/${restaurant.id}`} key={restaurant.id} className="group cursor-pointer block">
                      <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                        <div className="absolute bottom-3 left-4 z-20 text-white font-black text-xl tracking-tighter">Items at ₹99</div>
                        <Image 
                          src={restaurant.image || '/uploads/restaurant_banner.png'} 
                          alt={restaurant.shopName} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                      <h3 className="font-black text-[#02060c] text-lg truncate group-hover:text-swiggy-orange transition-colors">{restaurant.shopName}</h3>
                      <div className="flex items-center gap-1 text-[#02060c99] font-bold text-sm mt-1">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center scale-75">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                        <span>{meta.rating.toFixed(1)} • {meta.mins} mins</span>
                      </div>
                      <p className="text-[#02060c99] text-sm truncate mt-1 font-medium">{restaurant.address || 'Local Area'}</p>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

        </main>

        {/* Global Footer */}
        <footer className="bg-[#02060c] text-white pt-16 pb-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1">
                <Link href="/" className="text-3xl font-black text-white tracking-tight mb-4 block">
                  LocalSwig
                </Link>
                <p className="text-gray-400 font-bold leading-relaxed">
                  © 2026 Bundl Technologies Pvt. Ltd.<br/>
                  Delivering happiness across India.
                </p>
              </div>
              
              <div>
                <h4 className="font-black text-lg mb-6 tracking-wide uppercase text-xs text-gray-500">Company</h4>
                <ul className="space-y-4 text-gray-400 font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Swiggy Corporate</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-lg mb-6 tracking-wide uppercase text-xs text-gray-500">Contact us</h4>
                <ul className="space-y-4 text-gray-400 font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partner with us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Ride with us</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-lg mb-6 tracking-wide uppercase text-xs text-gray-500">Legal</h4>
                <ul className="space-y-4 text-gray-400 font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-500 font-bold">Created for Final Year Project by Paras Bhoite.</p>
              <div className="flex items-center gap-4 mt-4 md:mt-0 text-2xl">
                📱 💻 🚀
              </div>
            </div>
          </div>
        </footer>
      </HomeClientWrapper>

    </div>
  )
}

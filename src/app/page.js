'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AuthDrawer from '@/components/AuthDrawer'
import LocationPicker from '@/components/LocationPicker'

import { useSession, signOut } from 'next-auth/react'

export default function MegaAppHomePage() {
  const { data: session } = useSession()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authView, setAuthView] = useState('login')

  const openAuth = (view) => {
    setAuthView(view)
    setIsAuthOpen(true)
  }

  const handleCartClick = (e) => {
    if (!session) {
      e.preventDefault()
      openAuth('login')
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f5] font-sans text-swiggy-dark selection:bg-swiggy-orange selection:text-white">
      
      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm px-4 md:px-8 h-[80px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-3xl font-extrabold text-swiggy-orange tracking-tight">
            LocalSwig
          </Link>
          <div className="hidden md:block">
            <LocationPicker />
          </div>
        </div>
        
        <div className="flex items-center gap-6 font-bold text-[#3d4152]">
          <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-swiggy-orange transition-colors bg-gray-100 px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Search for restaurant, item or more
          </div>
          
          {session ? (
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                {(session.user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-extrabold text-[#02060c]">Hi, {session.user?.name || 'User'}</span>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              {session.user?.role === 'vendor' && (
                <Link href="/vendor" className="text-xs font-bold text-swiggy-orange hover:text-[#e06b0d] transition-colors">DASHBOARD</Link>
              )}
              {session.user?.role === 'admin' && (
                <Link href="/admin" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">ADMIN PORTAL</Link>
              )}
              <button onClick={() => signOut()} className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors">LOGOUT</button>
            </div>
          ) : (
            <>
              <button onClick={() => openAuth('login')} className="hover:text-swiggy-orange transition-colors font-bold">Login</button>
              <button onClick={() => openAuth('register')} className="bg-swiggy-orange text-white px-6 py-2 rounded-full hover:bg-[#e06b0d] transition-colors font-bold">Sign up</button>
            </>
          )}

          <Link href="/cart" onClick={handleCartClick} className="flex items-center gap-2 hover:text-swiggy-orange transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </Link>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-[1200px] mx-auto px-4 mt-8 pb-24">
        
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#282c3f] tracking-tight mb-1">
              Hi there! 👋
            </h1>
            <p className="text-[#686b78] font-medium text-lg">What are you looking for today?</p>
          </div>
        </div>

        {/* Primary Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Food Delivery Card */}
          <Link href="/food" className="group relative overflow-hidden rounded-[32px] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[280px]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full flex flex-col p-8 z-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#282c3f] mb-2">Food Delivery</h2>
              <p className="text-orange-600 font-bold text-lg mb-auto">UPTO 60% OFF</p>
              <div className="flex items-center gap-2 text-white bg-swiggy-orange w-max px-6 py-3 rounded-full font-bold transition-all shadow-md group-hover:bg-[#e06b0d]">
                Order Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-[240px] h-[240px] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
              <Image src="/uploads/burger_icon.png" alt="Food" fill className="object-cover rounded-tl-[120px]" />
            </div>
          </Link>

          {/* Instamart Card */}
          <Link href="/instamart" className="group relative overflow-hidden rounded-[32px] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[280px]">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50 to-pink-100 opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full flex flex-col p-8 z-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#282c3f] mb-2">Instamart</h2>
              <p className="text-pink-600 font-bold text-lg mb-auto">FREE DELIVERY</p>
              <div className="flex items-center gap-2 text-white bg-[#99226d] w-max px-6 py-3 rounded-full font-bold transition-all shadow-md group-hover:bg-[#7a1b57]">
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
          
          <div className="group relative overflow-hidden rounded-[24px] bg-white shadow-sm hover:shadow-md transition-all h-[160px] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent"></div>
            <div className="relative p-5">
              <h3 className="text-xl font-bold text-[#282c3f] mb-1">Dineout</h3>
              <p className="text-sm font-semibold text-blue-600">UPTO 50% OFF</p>
            </div>
            <div className="absolute right-0 bottom-0 w-[100px] h-[100px] transition-all group-hover:scale-110">
              <Image src="/uploads/pizza_icon.png" alt="Dineout" fill className="object-cover rounded-tl-[40px]" />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[24px] bg-white shadow-sm hover:shadow-md transition-all h-[160px] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-50 to-transparent"></div>
            <div className="relative p-5">
              <h3 className="text-xl font-bold text-[#282c3f] mb-1">Genie</h3>
              <p className="text-sm font-semibold text-teal-600">SEND PACKAGES</p>
            </div>
            <div className="absolute right-0 bottom-0 w-[100px] h-[100px] bg-teal-100 rounded-tl-full flex items-center justify-center text-3xl group-hover:bg-teal-200 transition-colors">
              📦
            </div>
          </div>

          <div className="col-span-2 relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#282c3f] to-[#3d4152] text-white shadow-sm flex items-center p-6 h-[160px] cursor-pointer hover:shadow-lg transition-shadow">
            <div className="z-10 max-w-[60%]">
              <div className="text-[10px] font-bold tracking-[2px] text-gray-400 mb-1 uppercase">LocalBiz One</div>
              <h3 className="text-2xl font-bold mb-2">Get Free Delivery</h3>
              <button className="bg-white text-[#282c3f] px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors">Explore Plans</button>
            </div>
            <div className="absolute right-0 top-0 h-full w-[40%] bg-gradient-to-l from-swiggy-orange/10 to-transparent flex items-center justify-center">
              <span className="text-5xl filter drop-shadow-xl animate-pulse">✨</span>
            </div>
          </div>

        </div>

        {/* Impressive Content: What's on your mind? */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-[#02060c] tracking-tight">What&apos;s on your mind?</h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 text-gray-400"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 text-swiggy-dark"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
            {[
              { name: 'Biryani', img: '/uploads/food_desserts.png' },
              { name: 'Pizzas', img: '/uploads/pizza_icon.png' },
              { name: 'Burgers', img: '/uploads/burger_icon.png' },
              { name: 'Desserts', img: '/uploads/food_desserts.png' },
              { name: 'Dairy', img: '/uploads/grocery_dairy.png' },
              { name: 'Vegetables', img: '/uploads/grocery_veg.png' },
              { name: 'Fruits', img: '/uploads/grocery_fruits.png' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0">
                <div className="w-[144px] h-[144px] rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative bg-white border-2 border-transparent group-hover:border-swiggy-orange">
                  <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="font-bold text-[#3d4152]">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Impressive Content: Top Chains */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-[#02060c] tracking-tight mb-6">Top brands for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Domino's Pizza", type: 'Pizzas, Italian', time: '25 mins', img: '/uploads/restaurant_banner.png' },
              { name: "Burger King", type: 'Burgers, American', time: '30 mins', img: '/uploads/burger_icon.png' },
              { name: "FreshMart Groceries", type: 'Fresh Produce, Dairy', time: '10 mins', img: '/uploads/grocery_dairy.png' },
              { name: "Sweet Tooth", type: 'Desserts, Bakery', time: '40 mins', img: '/uploads/food_desserts.png' },
            ].map((brand, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-sm group-hover:shadow-xl transition-shadow">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-3 left-4 z-20 text-white font-extrabold text-xl tracking-tight">₹100 OFF</div>
                  <Image src={brand.img} alt={brand.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-[#02060c] text-lg truncate">{brand.name}</h3>
                <div className="flex items-center gap-1 text-[#02060c99] font-medium text-sm mt-1">
                  <svg className="w-4 h-4 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>4.2 • {brand.time}</span>
                </div>
                <p className="text-[#02060c99] text-sm truncate mt-1">{brand.type}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Global Footer */}
      <footer className="bg-[#02060c] text-white pt-16 pb-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <Link href="/" className="text-3xl font-extrabold text-white tracking-tight mb-4 block">
                LocalSwig
              </Link>
              <p className="text-gray-400 font-medium leading-relaxed">
                © 2026 Bundl Technologies Pvt. Ltd.<br/>
                Delivering happiness across India.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 tracking-wide">Company</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Swiggy Corporate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 tracking-wide">Contact us</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner with us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ride with us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 tracking-wide">Legal</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 font-medium">Created for Final Year Project by Paras Bhoite.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0 text-2xl">
              📱 💻 🚀
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Drawer */}
      <AuthDrawer 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialView={authView} 
      />

    </div>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, LogOut, Store } from 'lucide-react'
import LocationPicker from './LocationPicker'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-[80px] flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-swiggy-orange rounded-xl flex items-center justify-center shadow-sm">
              <Store className="text-white" size={24} />
            </div>
            <span className="text-xl font-extrabold text-[#282c3f] tracking-tight">LocalBiz</span>
          </Link>
          <div className="hidden lg:block h-8 w-px bg-gray-200 mx-2"></div>
          <div className="hidden lg:block">
            <LocationPicker />
          </div>
        </div>

        <nav className="flex items-center gap-8">
          <Link href="/search" className="hidden lg:flex items-center gap-2 text-[#3d4152] hover:text-swiggy-orange font-bold text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Search
          </Link>

          {status === 'authenticated' ? (
            <>
              {session.user.role === 'vendor' ? (
                <Link key="dash" href="/vendor" className="flex items-center gap-2 text-[#3d4152] hover:text-swiggy-orange font-bold text-sm transition-colors">
                  <User size={18} />
                  Dashboard
                </Link>
              ) : session.user.role === 'admin' ? (
                <Link key="admin" href="/admin" className="flex items-center gap-2 text-[#3d4152] hover:text-indigo-600 font-bold text-sm transition-colors">
                  <User size={18} />
                  Admin
                </Link>
              ) : (
                <React.Fragment key="customer-nav">
                  <Link href="/orders" className="flex items-center gap-2 text-[#3d4152] hover:text-swiggy-orange font-bold text-sm transition-colors">
                    <User size={18} />
                    My Orders
                  </Link>
                </React.Fragment>
              )}
              
              <Link key="cart" href="/cart" className="flex items-center gap-2 text-[#3d4152] hover:text-swiggy-orange font-bold text-sm transition-colors">
                <ShoppingCart size={18} />
                Cart
              </Link>

              <div className="h-8 w-px bg-gray-200"></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-swiggy-orange border border-orange-100">
                   <User size={20} />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-black text-[#282c3f] truncate max-w-[100px]">{session.user.name || 'Profile'}</span>
                   <button 
                     onClick={() => signOut({ callbackUrl: '/' })} 
                     className="text-[10px] font-black text-red-500 uppercase tracking-widest text-left hover:underline"
                   >
                     Logout
                   </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[#3d4152] font-bold text-sm hover:text-swiggy-orange transition-colors">Login</Link>
              <Link href="/register" className="bg-swiggy-orange text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#e06b0d] transition-all shadow-md">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AuthDrawer({ isOpen, onClose, initialView = 'login' }) {
  const router = useRouter()
  const [view, setView] = useState(initialView)
  const [prevInitialView, setPrevInitialView] = useState(initialView)

  if (initialView !== prevInitialView) {
    setView(initialView)
    setPrevInitialView(initialView)
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState('customer')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    storeType: 'RESTAURANT'
  })

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // We don't return null so the CSS transitions can animate in/out smoothly.
  // Instead, we use pointer-events-none and opacity to hide it when closed.

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password
    })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      // Fetch session manually to determine role for redirect
      try {
        const sessionRes = await fetch('/api/auth/session')
        const sessionData = await sessionRes.json()
        
        if (sessionData?.user?.role === 'vendor') {
          window.location.href = '/vendor'
          return
        } else if (sessionData?.user?.role === 'admin') {
          window.location.href = '/admin'
          return
        }
      } catch (err) {
        console.error('Failed to fetch session', err)
      }

      router.refresh()
      onClose()
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      })

      if (res.ok) {
        setView('login') // Switch to login after successful register
        setError('')
      } else {
        const data = await res.text()
        setError(data || 'Failed to register')
      }
    } catch (error) {
      setError('An error occurred')
    }
    setLoading(false)
  }

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      {/* Backdrop overlay */}
      <div 
        className={`absolute inset-0 bg-[#02060c] cursor-pointer transition-opacity duration-300 ${isOpen ? 'opacity-70' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`relative w-full max-w-[500px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute left-4 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
        >
          <svg className="w-6 h-6 text-[#3d4152]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="px-10 pt-16 flex-1 flex flex-col">
          
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-4xl font-extrabold text-[#02060c] tracking-tight mb-2">
                {view === 'login' ? 'Login' : 'Sign up'}
              </h2>
              <p className="text-sm text-[#02060c99]">
                or <button onClick={(e) => { e.preventDefault(); setView(view === 'login' ? 'register' : 'login'); }} className="text-swiggy-orange font-bold hover:text-[#e06b0d] transition-colors focus:outline-none">
                  {view === 'login' ? 'create an account' : 'login to your account'}
                </button>
              </p>
            </div>
            <div className="w-[100px] h-[100px] relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center -mt-2 shadow-sm border border-orange-100">
              <svg className="w-12 h-12 text-swiggy-orange drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6">
              {error}
            </div>
          )}

          {view === 'register' && (
            <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
              <button 
                type="button"
                className={`flex-1 py-2 font-bold text-sm rounded-lg transition-all ${role === 'customer' ? 'bg-white shadow-sm text-[#02060c]' : 'text-[#93959f] hover:text-[#02060c]'}`}
                onClick={() => setRole('customer')}
              >
                Customer
              </button>
              <button 
                type="button"
                className={`flex-1 py-2 font-bold text-sm rounded-lg transition-all ${role === 'vendor' ? 'bg-white shadow-sm text-[#02060c]' : 'text-[#93959f] hover:text-[#02060c]'}`}
                onClick={() => setRole('vendor')}
              >
                Partner / Vendor
              </button>
            </div>
          )}

          <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-6">
            
            {view === 'register' && (
              <div className="relative">
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="peer w-full px-4 pt-6 pb-2 border border-[#bebfc5] rounded-xl text-[#02060c] font-medium focus:outline-none focus:border-swiggy-orange focus:ring-1 focus:ring-swiggy-orange transition-all placeholder-transparent" 
                  placeholder="Name"
                />
                <label className="absolute left-4 top-2 text-xs font-semibold text-[#93959f] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-swiggy-orange pointer-events-none">
                  Full Name
                </label>
              </div>
            )}

            <div className="relative">
              <input 
                required
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full px-4 pt-6 pb-2 border border-[#bebfc5] rounded-xl text-[#02060c] font-medium focus:outline-none focus:border-swiggy-orange focus:ring-1 focus:ring-swiggy-orange transition-all placeholder-transparent" 
                placeholder="Email"
              />
              <label className="absolute left-4 top-2 text-xs font-semibold text-[#93959f] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-swiggy-orange pointer-events-none">
                Email Address
              </label>
            </div>

            {view === 'register' && role === 'vendor' && (
              <>
                <div className="relative animate-fade-in">
                  <input 
                    required
                    type="text" 
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    className="peer w-full px-4 pt-6 pb-2 border border-[#bebfc5] rounded-xl text-[#02060c] font-medium focus:outline-none focus:border-swiggy-orange focus:ring-1 focus:ring-swiggy-orange transition-all placeholder-transparent" 
                    placeholder="Shop Name"
                  />
                  <label className="absolute left-4 top-2 text-xs font-semibold text-[#93959f] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-swiggy-orange pointer-events-none">
                    Shop Name
                  </label>
                </div>

                <div className="animate-fade-in">
                  <p className="text-xs font-semibold text-[#93959f] mb-2 px-1">Store Type</p>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all border ${formData.storeType === 'RESTAURANT' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-[#bebfc5] text-[#3d4152] hover:bg-gray-50'}`}
                      onClick={() => setFormData({ ...formData, storeType: 'RESTAURANT' })}
                    >
                      Restaurant
                    </button>
                    <button 
                      type="button"
                      className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all border ${formData.storeType === 'GROCERY' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-[#bebfc5] text-[#3d4152] hover:bg-gray-50'}`}
                      onClick={() => setFormData({ ...formData, storeType: 'GROCERY' })}
                    >
                      Instamart
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <input 
                required
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="peer w-full px-4 pt-6 pb-2 border border-[#bebfc5] rounded-xl text-[#02060c] font-medium focus:outline-none focus:border-swiggy-orange focus:ring-1 focus:ring-swiggy-orange transition-all placeholder-transparent" 
                placeholder="Password"
              />
              <label className="absolute left-4 top-2 text-xs font-semibold text-[#93959f] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-swiggy-orange pointer-events-none">
                Password
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{ backgroundColor: '#fc8019', color: '#ffffff' }}
              className="w-full font-extrabold text-lg py-4 rounded-xl mt-4 transition-colors shadow-md disabled:opacity-70 tracking-wide"
            >
              {loading ? 'PROCESSING...' : view === 'login' ? 'LOGIN TO YOUR ACCOUNT' : 'CONTINUE TO SIGN UP'}
            </button>
          </form>

          <p className="text-xs text-[#93959f] mt-6 font-medium leading-relaxed">
            By clicking on Login, I accept the <span className="text-[#02060c] font-bold cursor-pointer hover:underline">Terms & Conditions</span> & <span className="text-[#02060c] font-bold cursor-pointer hover:underline">Privacy Policy</span>
          </p>

          {/* Decorative Footer Illustration to make drawer look full & premium */}
          <div className="mt-auto pt-16 pb-8 flex flex-col items-center justify-center opacity-80">
            <div className="relative w-[280px] h-[200px]">
              {/* Fallback to a food image instead of being empty */}
              <Image 
                src="/uploads/food_desserts.png" 
                alt="Food Delivery" 
                fill
                className="object-cover w-full h-full rounded-2xl grayscale opacity-20" 
              />
            </div>
            <p className="text-[#02060c99] text-xs font-bold tracking-widest mt-4">LOCALSIG ✦ FOOD & GROCERY</p>
          </div>

        </div>
      </div>
    </div>
  )
}

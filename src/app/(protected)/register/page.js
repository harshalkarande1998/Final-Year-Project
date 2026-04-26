'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, User, Store } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState('customer')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '', // only for vendors
    storeType: 'RESTAURANT'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
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
        router.push('/login')
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
    <div className="min-h-screen bg-[#f0f0f5] flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-[520px] bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] animate-fade-in">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#282c3f] tracking-tight mb-2">Sign up</h1>
            <p className="text-sm text-[#686b78] font-semibold">
              or <Link href="/login" className="text-[#fc8019] hover:underline">login to your account</Link>
            </p>
            <div className="w-12 h-1.5 bg-[#282c3f] mt-6 rounded-full"></div>
          </div>
          <div className="w-20 h-20 bg-[#fef2f2] rounded-3xl flex items-center justify-center shadow-inner">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <UserPlus className="text-[#fc8019]" size={24} />
             </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        <div className="flex bg-[#f1f1f6] p-1.5 rounded-2xl mb-8">
          <button 
            type="button"
            className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'customer' ? 'bg-white shadow-md text-[#282c3f]' : 'text-[#686b78] hover:text-[#282c3f]'}`}
            onClick={() => setRole('customer')}
          >
            <User size={16} />
            Customer
          </button>
          <button 
            type="button"
            className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'vendor' ? 'bg-white shadow-md text-[#282c3f]' : 'text-[#686b78] hover:text-[#282c3f]'}`}
            onClick={() => setRole('vendor')}
          >
            <Store size={16} />
            Partner / Vendor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-[#93959f] ml-1">Full Name</label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-[#f1f1f6] border-2 border-transparent rounded-2xl text-[#282c3f] font-bold focus:outline-none focus:border-[#fc8019] focus:bg-white transition-all" 
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-[#93959f] ml-1">Email Address</label>
            <input 
              required
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-[#f1f1f6] border-2 border-transparent rounded-2xl text-[#282c3f] font-bold focus:outline-none focus:border-[#fc8019] focus:bg-white transition-all" 
              placeholder="customer@gmail.com"
            />
          </div>

          {role === 'vendor' && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-[#93959f] ml-1">Shop Name</label>
                <input 
                  required
                  type="text" 
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#f1f1f6] border-2 border-transparent rounded-2xl text-[#282c3f] font-bold focus:outline-none focus:border-[#fc8019] focus:bg-white transition-all" 
                  placeholder="e.g. Tasty Treats"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-[#93959f] ml-1">Store Type</label>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    className={`flex-1 py-4 font-bold text-sm rounded-2xl transition-all border-2 ${formData.storeType === 'RESTAURANT' ? 'border-[#fc8019] bg-[#fff7ed] text-[#fc8019]' : 'border-transparent bg-[#f1f1f6] text-[#686b78]'}`}
                    onClick={() => setFormData({ ...formData, storeType: 'RESTAURANT' })}
                  >
                    Restaurant
                  </button>
                  <button 
                    type="button"
                    className={`flex-1 py-4 font-bold text-sm rounded-2xl transition-all border-2 ${formData.storeType === 'GROCERY' ? 'border-[#fc8019] bg-[#fff7ed] text-[#fc8019]' : 'border-transparent bg-[#f1f1f6] text-[#686b78]'}`}
                    onClick={() => setFormData({ ...formData, storeType: 'GROCERY' })}
                  >
                    Instamart
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-[#93959f] ml-1">Password</label>
            <input 
              required
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-[#f1f1f6] border-2 border-transparent rounded-2xl text-[#282c3f] font-bold focus:outline-none focus:border-[#fc8019] focus:bg-white transition-all" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              backgroundColor: '#fc8019', 
              boxShadow: '0 10px 20px rgba(252, 128, 25, 0.25)' 
            }}
            className="w-full text-white font-black text-lg py-5 rounded-2xl mt-6 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? (
               <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'CREATE ACCOUNT'
            )}
          </button>
        </form>

        <p className="text-[11px] text-[#93959f] mt-10 font-bold uppercase tracking-wider text-center border-t border-[#f1f1f6] pt-6">
          By clicking on Create, I accept the <span className="text-[#282c3f]">Terms & Conditions</span> & <span className="text-[#282c3f]">Privacy Policy</span>
        </p>

      </div>
    </div>
  )
}

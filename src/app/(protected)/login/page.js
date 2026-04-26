'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
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
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f5] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] animate-fade-in">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#282c3f] tracking-tight mb-2">Login</h1>
            <p className="text-sm text-[#686b78] font-semibold">
              or <Link href="/register" className="text-[#fc8019] hover:underline">create an account</Link>
            </p>
            <div className="w-12 h-1.5 bg-[#02060c] mt-6 rounded-full"></div>
          </div>
          <div className="w-20 h-20 bg-[#fef2f2] rounded-3xl flex items-center justify-center shadow-inner">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <User className="text-[#fc8019]" size={24} />
             </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-[#93959f] ml-1">Email Address</label>
            <input 
              required
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-[#f1f1f6] border-2 border-transparent rounded-2xl text-[#282c3f] font-bold focus:outline-none focus:border-[#fc8019] focus:bg-white transition-all placeholder:text-[#93959f]/50" 
              placeholder="customer@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-[#93959f] ml-1">Password</label>
            <input 
              required
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-[#f1f1f6] border-2 border-transparent rounded-2xl text-[#282c3f] font-bold focus:outline-none focus:border-[#fc8019] focus:bg-white transition-all placeholder:text-[#93959f]/50" 
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
              <>
                <LogIn size={20} />
                LOGIN
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-[#93959f] mt-10 font-bold uppercase tracking-wider text-center border-t border-[#f1f1f6] pt-6">
          By clicking on Login, I accept the <span className="text-[#282c3f]">Terms & Conditions</span> & <span className="text-[#282c3f]">Privacy Policy</span>
        </p>

      </div>
    </div>
  )
}

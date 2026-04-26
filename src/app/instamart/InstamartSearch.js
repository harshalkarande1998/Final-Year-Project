'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export default function InstamartSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    router.push(`/instamart?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for groceries, snacks and more..." 
        className="w-full px-8 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:bg-white focus:text-[#282c3f] transition-all font-bold text-lg shadow-2xl"
      />
      <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-white group-focus-within:text-[#282c3f] hover:scale-110 transition-transform">
         <Search className="w-6 h-6" strokeWidth={3} />
      </button>
    </form>
  )
}

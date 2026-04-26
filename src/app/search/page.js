'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { Search as SearchIcon, X, ArrowRight, History, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const trendingSearches = ['Biryani', 'Pizza', 'Burgers', 'Cakes', 'Chinese', 'North Indian']
  const recentSearches = ['Pizza Hut', 'Domino\'s', 'KFC']

  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true)
      const fetchResults = async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await res.json()
          setResults(data.results || [])
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setIsSearching(false)
        }
      }

      const timer = setTimeout(fetchResults, 300)
      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [query])

  return (
    <div className="min-h-screen bg-white font-sans text-swiggy-dark">
      <Navbar />
      
      <div className="max-w-[800px] mx-auto px-4 py-12">
        {/* Search Input Area */}
        <div className="relative group">
          <input 
            type="text"
            placeholder="Search for restaurants and food"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-16 pl-14 pr-12 rounded-2xl border-2 border-gray-100 focus:border-swiggy-orange outline-none text-lg font-bold transition-all shadow-sm group-hover:shadow-md"
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-swiggy-dark"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {!query && (
          <div className="mt-12 animate-fade-in">
            {/* Recent Searches */}
            <div className="mb-12">
              <div className="flex items-center gap-2 text-[#02060c99] font-black text-xs uppercase tracking-widest mb-4">
                <History size={14} />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => setQuery(s)}
                    className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm text-[#3d4152] hover:bg-gray-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div>
              <div className="flex items-center gap-2 text-[#02060c99] font-black text-xs uppercase tracking-widest mb-4">
                <TrendingUp size={14} />
                Popular Cuisines
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {trendingSearches.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setQuery(s)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all text-left"
                  >
                    <span className="font-bold text-[#3d4152]">{s}</span>
                    <ArrowRight size={16} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {query && (
          <div className="mt-8 animate-fade-in">
            {isSearching ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-12 h-12 border-4 border-orange-100 border-t-swiggy-orange rounded-full animate-spin"></div>
                <p className="mt-4 text-[#686b78] font-bold">Finding the best for you...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((item) => {
                  const isFood = item.type === 'RESTAURANT' || item.type === 'DISH';
                  return (
                    <Link 
                      href={item.link} 
                      key={`${item.type}-${item.id}`}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                    >
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-sm border ${isFood ? 'bg-orange-50 border-orange-100' : 'bg-fuchsia-50 border-fuchsia-100'}`}>
                        {item.type === 'RESTAURANT' ? '🍱' : item.type === 'DISH' ? '🍲' : item.type === 'STORE' ? '🏪' : '🍎'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-[#02060c] group-hover:text-swiggy-orange transition-colors">{item.name}</h3>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${isFood ? 'bg-orange-100 text-orange-600' : 'bg-fuchsia-100 text-fuchsia-600'}`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[#686b78] text-sm font-medium">{item.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 group-hover:text-swiggy-orange transition-all">
                        <span className="text-xs font-black opacity-0 group-hover:opacity-100 uppercase tracking-widest">View</span>
                        <ArrowRight size={20} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-black text-[#02060c]">No results found</h3>
                <p className="text-[#686b78] font-medium">Try searching for something else</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

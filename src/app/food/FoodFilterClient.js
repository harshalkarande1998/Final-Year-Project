'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Filter, ChevronDown, Check } from 'lucide-react'

export default function FoodFilterClient({ initialRestaurants }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [restaurants, setRestaurants] = useState(initialRestaurants)

  // Mock metadata for filtering
  const getRestaurantMeta = (restaurant) => {
    const idNum = parseInt(restaurant.id.slice(-4), 16) || 0
    return {
      rating: 3.8 + (idNum % 12) / 10, // 3.8 to 5.0
      mins: 15 + (idNum % 45),        // 15 to 60 mins
      avgPrice: 150 + (idNum % 10) * 100 // 150 to 1150
    }
  }

  const sortOptions = [
    { id: 'relevance', label: 'Relevance (Default)' },
    { id: 'deliveryTime', label: 'Delivery Time' },
    { id: 'rating', label: 'Rating' },
    { id: 'costLowHigh', label: 'Cost: Low to High' },
    { id: 'costHighLow', label: 'Cost: High to Low' }
  ]

  const handleSort = (optionId) => {
    setSortBy(optionId)
    setShowSortMenu(false)
    
    let sorted = [...restaurants]
    if (optionId === 'deliveryTime') {
      sorted.sort((a, b) => getRestaurantMeta(a).mins - getRestaurantMeta(b).mins)
    } else if (optionId === 'rating') {
      sorted.sort((a, b) => getRestaurantMeta(b).rating - getRestaurantMeta(a).rating)
    } else if (optionId === 'costLowHigh') {
      sorted.sort((a, b) => getRestaurantMeta(a).avgPrice - getRestaurantMeta(b).avgPrice)
    } else if (optionId === 'costHighLow') {
      sorted.sort((a, b) => getRestaurantMeta(b).avgPrice - getRestaurantMeta(a).avgPrice)
    } else {
      sorted = [...initialRestaurants] // reset to relevance
    }
    setRestaurants(sorted)
  }

  const applyFilter = (filterType) => {
    let filtered = initialRestaurants
    const newFilter = activeFilter === filterType ? 'all' : filterType
    setActiveFilter(newFilter)

    if (newFilter === 'fast') {
      filtered = initialRestaurants.filter(r => getRestaurantMeta(r).mins <= 35)
    } else if (newFilter === 'rating') {
      filtered = initialRestaurants.filter(r => getRestaurantMeta(r).rating >= 4.0)
    } else if (newFilter === 'price') {
      filtered = initialRestaurants.filter(r => {
        const price = getRestaurantMeta(r).avgPrice
        return price >= 300 && price <= 600
      })
    }

    setRestaurants(filtered)
  }

  const filters = [
    { id: 'fast', label: 'Fast Delivery' },
    { id: 'rating', label: 'Ratings 4.0+' },
    { id: 'price', label: 'Rs. 300-Rs. 600' }
  ]

  return (
    <>
      {/* Filters Bar */}
      <div className="mb-8 flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 relative">
         <button className="flex items-center gap-2 border border-[#e2e2e7] rounded-full px-4 py-2 text-sm font-bold text-[#282c3f] shadow-sm hover:bg-gray-50 transition-all whitespace-nowrap bg-white">
            Filter <Filter size={14} />
         </button>
         
         {/* Sort Dropdown */}
         <div className="relative">
           <button 
             onClick={() => setShowSortMenu(!showSortMenu)}
             className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-bold transition-all whitespace-nowrap shadow-sm bg-white ${sortBy !== 'relevance' ? 'border-swiggy-orange text-swiggy-orange' : 'border-[#e2e2e7] text-[#282c3f]'}`}
           >
              Sort By: {sortOptions.find(o => o.id === sortBy)?.label.split('(')[0]} <ChevronDown size={14} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
           </button>
           
           {showSortMenu && (
             <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 py-2 animate-fade-in">
                {sortOptions.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => handleSort(opt.id)}
                    className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors flex items-center justify-between ${sortBy === opt.id ? 'text-swiggy-orange bg-orange-50' : 'text-[#686b78] hover:bg-gray-50'}`}
                  >
                    {opt.label}
                    {sortBy === opt.id && <Check size={14} />}
                  </button>
                ))}
             </div>
           )}
         </div>
         
         {filters.map(f => (
           <button 
             key={f.id}
             onClick={() => applyFilter(f.id)}
             className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
               activeFilter === f.id 
                 ? 'bg-orange-50 border-swiggy-orange text-swiggy-orange' 
                 : 'bg-white border-[#e2e2e7] text-[#282c3f] hover:bg-gray-50'
             }`}
           >
             {f.label}
             {activeFilter === f.id && <Check size={14} />}
           </button>
         ))}
      </div>

      {/* Restaurants Grid */}
      <section>
        <h2 className="text-[24px] font-black tracking-tight text-[#02060cE6] mb-8">
          {activeFilter === 'all' ? 'Restaurants with online food delivery in your location' : `Showing results for ${filters.find(f => f.id === activeFilter)?.label || activeFilter}`}
        </h2>
        
        {restaurants.length === 0 ? (
          <div className="bg-[#f0f0f5] rounded-[32px] p-20 text-center border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-bold mb-2">No matches found</h3>
            <p className="text-[#686b78]">Try removing some filters to see more restaurants</p>
            <button onClick={() => { setRestaurants(initialRestaurants); setActiveFilter('all'); }} className="mt-4 text-swiggy-orange font-bold hover:underline">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fade-in">
            {restaurants.map(restaurant => {
              const meta = getRestaurantMeta(restaurant)
              return (
                <Link key={restaurant.id} href={`/food/restaurant/${restaurant.id}`} className="block group">
                  <div className="relative hover:scale-[0.97] transition-transform duration-300 ease-in-out">
                    <div className="relative h-[180px] rounded-[24px] overflow-hidden mb-4 shadow-lg border border-gray-100">
                       <Image 
                         src={restaurant.image || "/uploads/restaurant_banner.png"} 
                         alt={restaurant.shopName} 
                         fill 
                         className="object-cover group-hover:scale-105 transition-transform duration-700" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-transparent to-transparent opacity-80" />
                       <div className="absolute bottom-3 left-4 right-4 font-black text-[20px] text-white tracking-tighter uppercase">
                         Items at ₹99
                       </div>
                    </div>
                    
                    <div className="px-1">
                      <h3 className="text-[18px] font-black text-[#282c3f] mb-1 truncate group-hover:text-swiggy-orange transition-colors">{restaurant.shopName}</h3>
                      <div className="flex items-center gap-1.5 font-bold text-[#3d4152] text-[15px] mb-1">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        {meta.rating.toFixed(1)} • {meta.mins} mins
                      </div>
                      <p className="text-[#686b78] text-[14px] truncate font-medium">North Indian, Chinese, Fast Food</p>
                      <p className="text-[#686b78] text-[14px] truncate font-medium mt-0.5">{restaurant.address || 'Local Area'}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

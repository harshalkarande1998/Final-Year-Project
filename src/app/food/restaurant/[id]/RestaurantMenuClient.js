'use client'

import { useState } from 'react'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'

export default function RestaurantMenuClient({ groupedProducts, cartMap }) {
  const [filter, setFilter] = useState('all') // 'all', 'veg', 'non-veg'

  const isNonVeg = (item) => {
    const name = item.name.toLowerCase()
    return name.includes('chicken') || name.includes('meat') || name.includes('pepperoni') || 
           name.includes('beef') || name.includes('bacon') || name.includes('fish') || 
           name.includes('egg') || name.includes('prawn')
  }

  const [searchQuery, setSearchQuery] = useState('')

  const filterItems = (items) => {
    let filtered = items
    if (filter === 'veg') filtered = items.filter(item => !isNonVeg(item))
    if (filter === 'non-veg') filtered = items.filter(item => isNonVeg(item))
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    return filtered
  }

  return (
    <div className="menu-content">
      {/* Search Bar */}
      <div className="relative mb-8">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for dishes"
          className="w-full bg-[#f1f1f6] border-none rounded-2xl py-4 px-12 font-bold text-[#3d4152] placeholder:text-[#93959f] focus:ring-2 focus:ring-gray-200 outline-none transition-all text-center"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#686b78]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Veg/Non-Veg Toggle Pills */}
      <div className="filter-controls flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
        <button 
          onClick={() => setFilter(filter === 'veg' ? 'all' : 'veg')}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${filter === 'veg' ? 'border-green-600 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center rounded-sm bg-white shrink-0">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${filter === 'veg' ? 'bg-green-600' : 'bg-gray-200'}`}>
             <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${filter === 'veg' ? 'right-0.5' : 'left-0.5'}`}></div>
          </div>
        </button>

        <button 
          onClick={() => setFilter(filter === 'non-veg' ? 'all' : 'non-veg')}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${filter === 'non-veg' ? 'border-red-600 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="w-4 h-4 border-2 border-red-600 flex items-center justify-center rounded-sm bg-white shrink-0">
            <div className="w-2 h-2 bg-red-600 rotate-45" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${filter === 'non-veg' ? 'bg-red-600' : 'bg-gray-200'}`}>
             <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${filter === 'non-veg' ? 'right-0.5' : 'left-0.5'}`}></div>
          </div>
        </button>

        <button 
          className="px-4 py-2 rounded-full border border-gray-200 text-[#3d4152] font-bold text-sm hover:bg-gray-50 transition-all"
        >
          Bestseller
        </button>
      </div>

      <div className="menu-section">
        {Object.entries(groupedProducts).map(([category, items]) => {
          const filteredItems = filterItems(items)
          if (filteredItems.length === 0) return null

          return (
            <div key={category} className="menu-category-group">
              <h2 className="category-heading">{category}</h2>
              <div className="menu-items-list">
                {filteredItems.map(item => (
                  <div key={item.id} className="menu-item-row">
                    <div className="item-info">
                      <div className={`veg-badge ${isNonVeg(item) ? 'non-veg' : ''}`}></div>
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price">₹{item.price.toFixed(2)}</p>
                      <p className="item-desc">{item.description}</p>
                    </div>
                    <div className="item-action">
                      <div className="item-image-wrapper">
                         <Image 
                           src={item.image || "/uploads/landing_food_banner.png"} 
                           alt={item.name} 
                           fill 
                           className="item-img-optimized"
                         />
                      </div>
                      <div className="add-btn-wrapper">
                         <AddToCartButton 
                           productId={item.id} 
                           initialQuantity={cartMap[item.id] || 0}
                         />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        
        {Object.values(groupedProducts).every(items => filterItems(items).length === 0) && (
          <div className="empty-menu py-12 text-center bg-gray-50 rounded-3xl">
            <p className="text-[#686b78] font-bold">No {filter} items found in this menu.</p>
            <button onClick={() => setFilter('all')} className="text-swiggy-orange font-bold mt-2 hover:underline">Show all items</button>
          </div>
        )}
      </div>
    </div>
  )
}

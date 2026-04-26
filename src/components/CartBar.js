'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function CartBar({ items: initialItems }) {
  const [items, setItems] = useState(initialItems || [])
  const [prevInitialItems, setPrevInitialItems] = useState(initialItems)
  const pathname = usePathname()

  if (initialItems !== prevInitialItems) {
    setItems(initialItems || [])
    setPrevInitialItems(initialItems)
  }

  useEffect(() => {
    // If items are passed as props, we are already syncing them above
    if (initialItems) return

    // Otherwise fetch them (for pages like Instamart where it's used globally)
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart/list')
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchCart()
    
    // Refresh every few seconds to keep in sync
    const interval = setInterval(fetchCart, 3000)
    return () => clearInterval(interval)
  }, [initialItems, pathname])

  if (!items || items.length === 0) return null
  
  // Don't show cart bar on the cart page itself
  if (pathname === '/cart' || pathname === '/checkout') return null

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

  // Determine variant based on products in cart
  const isInstamartPage = pathname.includes('/instamart')
  const hasInstamartItems = items.some(item => item.product?.vendor?.storeType === 'GROCERY')
  const isInstamart = isInstamartPage || hasInstamartItems

  const barBg = isInstamart ? 'bg-[#99226d]' : 'bg-[#60b246]'

  return (
    <div className={`fixed bottom-6 inset-x-0 mx-auto w-[90%] max-w-[800px] ${barBg} text-white px-8 py-4 z-[9999] rounded-[24px] animate-fade-in shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-[#ffffff25]`}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-[17px] font-black uppercase tracking-tight flex items-center gap-2">
            {totalCount} {totalCount === 1 ? 'Item' : 'Items'} <span className="opacity-30">|</span> ₹{totalPrice.toFixed(0)}
          </span>
          <span className="text-[10px] font-black opacity-70 uppercase tracking-widest">View details & checkout</span>
        </div>
        
        <Link 
          href="/cart" 
          className="flex items-center gap-4 text-[15px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          VIEW CART
          <div className="bg-white/20 p-2 rounded-2xl group-hover:bg-white/30 transition-colors">
            <ShoppingBag size={20} />
          </div>
        </Link>
      </div>
    </div>
  )
}

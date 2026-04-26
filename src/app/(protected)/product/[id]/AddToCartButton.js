'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'

export default function AddToCartButton({ productId }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    if (session.user.role === 'vendor') {
      alert("Vendors cannot add items to cart.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      })

      if (res.ok) {
        router.push('/cart')
      } else {
        const errorText = await res.text()
        alert(errorText || "Failed to add to cart.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred while adding to cart.")
    }
    setLoading(false)
  }

  return (
    <div className="add-to-cart-container">
      <div className="quantity-selector">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">-</button>
        <span className="qty-value">{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
      </div>
      
      <button 
        onClick={handleAddToCart} 
        disabled={loading}
        className="btn-primary"
      >
        <ShoppingCart size={20} />
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AddToCartButton({ productId, initialQuantity = 0, variant = 'food' }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(initialQuantity)

  const updateCart = async (newQty) => {
    if (!session) {
      window.location.href = '/login'
      return
    }

    const delta = newQty - quantity
    if (delta === 0) return

    setLoading(true)
    try {
      let res;
      if (newQty > 0) {
        res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: delta })
        })
      } else {
        res = await fetch(`/api/cart?productId=${productId}`, {
          method: 'DELETE'
        })
      }

      if (res.ok) {
        setQuantity(newQty)
        router.refresh()
      } else {
        if (res.status === 409) {
          const msg = await res.text()
          if (confirm(`${msg}\n\nClear cart and add this item?`)) {
             // In a real app, we'd call a clear cart API then add. 
             // For now, let's just redirect to cart to let them clear it.
             router.push('/cart')
          }
        } else {
          const err = await res.text()
          console.error(err || 'Failed to update cart')
        }
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  if (quantity > 0) {
    return (
      <div className={`swiggy-counter ${variant}`}>
        <button onClick={() => updateCart(quantity - 1)} disabled={loading} className="counter-btn">-</button>
        <span className="counter-val">{quantity}</span>
        <button onClick={() => updateCart(quantity + 1)} disabled={loading} className="counter-btn">+</button>
      </div>
    )
  }

  return (
    <button 
      onClick={() => updateCart(1)} 
      disabled={loading}
      className={`swiggy-add-btn ${variant}`}
    >
      {loading ? '...' : 'ADD'}
    </button>
  )
}

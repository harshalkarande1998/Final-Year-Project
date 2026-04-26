'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'

export default function CartList({ initialItems }) {
  const [items, setItems] = useState(initialItems)
  const router = useRouter()

  const handleRemove = async (id) => {
    try {
      await fetch(`/api/cart?id=${id}`, { method: 'DELETE' })
      setItems(items.filter(i => i.id !== id))
      router.refresh()
    } catch (e) {
      console.error(e)
    }
  }

  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p style={{marginBottom: '2rem', color: '#686b78'}}>Add some delicious items from our restaurants to get started!</p>
        <Link href="/food" className="checkout-btn" style={{ maxWidth: '200px', display: 'inline-block' }}>
          Browse Food
        </Link>
      </div>
    )
  }

  // Group items by vendor
  const groupedItems = items.reduce((acc, item) => {
    const shopName = item.product.vendor?.shopName || 'General Store'
    if (!acc[shopName]) acc[shopName] = { 
      name: shopName, 
      address: item.product.vendor?.address || 'Local Delivery',
      items: [] 
    }
    acc[shopName].items.push(item)
    return acc
  }, {})

  return (
    <div className="cart-layout">
      <div className="cart-items-section">
        {Object.values(groupedItems).map((group, idx) => (
          <div key={idx} className="vendor-group mb-10">
            <div className="cart-restaurant-info">
              <h2 className="restaurant-name-header">{group.name}</h2>
              <p className="restaurant-address-sub">{group.address}</p>
              <div className="header-divider"></div>
            </div>
            
            <div className="space-y-4">
              {group.items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-main">
                    <div className="item-img-container">
                      <Image 
                        src={item.product.image || '/uploads/landing_food_banner.png'} 
                        alt={item.product.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="item-details">
                      <h3>{item.product.name}</h3>
                      <p className="text-[#686b78] font-bold">₹{item.product.price.toFixed(0)}</p>
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <div className="qty-badge">x{item.quantity}</div>
                    <span className="item-total">₹{(item.product.price * item.quantity).toFixed(0)}</span>
                    <button onClick={() => handleRemove(item.id)} className="btn-icon-round" title="Remove Item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <hr className="summary-divider" />
        <div className="summary-row total-row">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        
        <Link href="/checkout" className="btn-primary checkout-btn">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

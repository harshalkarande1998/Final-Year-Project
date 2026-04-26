'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Package, Clock, Utensils, Bike } from 'lucide-react'
import HelpChatbot from '@/components/HelpChatbot'

export default function ClientOrdersList({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders)
  const [activeHelpOrder, setActiveHelpOrder] = useState(null)

  // Simulation Logic: Auto-advance "pending" orders
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(currentOrders => currentOrders.map(order => {
        if (order.status === 'pending') {
          // 30% chance to move to preparing
          if (Math.random() > 0.7) return { ...order, status: 'preparing' }
        }
        if (order.status === 'preparing') {
          // 20% chance to move to out_for_delivery
          if (Math.random() > 0.8) return { ...order, status: 'out_for_delivery' }
        }
        if (order.status === 'out_for_delivery') {
          // 10% chance to move to delivered
          if (Math.random() > 0.9) return { ...order, status: 'delivered' }
        }
        return order
      }))
    }, 5000) // Check every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'preparing': return { label: 'Chef is preparing your food', icon: <Utensils size={14} />, color: '#fc8019' }
      case 'out_for_delivery': return { label: 'Valet is on the way', icon: <Bike size={14} />, color: '#fc8019' }
      case 'delivered': return { label: 'Delivered', icon: <Check size={14} />, color: '#60b246' }
      default: return { label: 'Order Placed', icon: <Clock size={14} />, color: '#93959f' }
    }
  }

  return (
    <>
      <div className="orders-list">
        {orders.map(order => {
          const isInstamart = order.product.vendor?.storeType === 'INSTAMART'
          const brandText = isInstamart ? 'text-[#99226d]' : 'text-swiggy-orange'
          const brandBg = isInstamart ? 'bg-[#99226d]' : 'bg-swiggy-orange'
          const brandLightBg = isInstamart ? 'bg-pink-50' : 'bg-orange-50'

          return (
            <div key={order.id} className="order-card animate-scale-up">
              {/* Card Header */}
              <div className="order-header-modern">
                <div className="flex gap-5">
                    <div className="order-shop-image relative overflow-hidden">
                      <Image 
                        src={order.product.vendor?.image || (isInstamart ? "/uploads/instamart_banner.png" : "/uploads/restaurant_banner.png")} 
                        alt={order.product.vendor?.shopName || 'Shop'}
                        fill
                        className="object-cover"
                      />
                    </div>
                   <div className="order-shop-details">
                      <h3 className={`text-lg font-black ${brandText}`}>{order.product.vendor?.shopName || 'Local Shop'}</h3>
                      <p className="address">{order.product.vendor?.address || 'Pune'}</p>
                      <p className="order-id">ORDER #{order.id.slice(-6).toUpperCase()} | {new Date(order.placedAt).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      <Link href={`/orders/track/${order.id}`} className="view-details-link" style={{ color: isInstamart ? '#99226d' : '#fc8019' }}>View Details</Link>
                   </div>
                </div>
                
                <div className="order-status-info">
                   <div className="delivered-status flex items-center gap-2" style={{ color: getStatusDisplay(order.status).color }}>
                      {getStatusDisplay(order.status).label}
                      <div className="status-delivered-dot flex items-center justify-center p-0.5" style={{ background: getStatusDisplay(order.status).color }}>
                         {getStatusDisplay(order.status).icon}
                      </div>
                   </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="order-body-modern">
                 <div className="item-list">
                    <span className="font-bold text-[#282c3f]">{order.product.name} x {order.quantity}</span>
                 </div>
                 <div className="total-amount">
                    Total Paid: <span className="font-black text-[#282c3f]">₹{(order.product.price * order.quantity).toFixed(0)}</span>
                 </div>
              </div>

              {/* Actions */}
              <div className="order-actions">
                 <Link href={isInstamart ? '/instamart' : `/food/restaurant/${order.product.vendorId}`}>
                    <button className="reorder-btn" style={{ background: isInstamart ? '#99226d' : '#fc8019' }}>Reorder</button>
                 </Link>
                 <button 
                   onClick={() => setActiveHelpOrder(order)}
                   className="help-btn"
                   style={{ 
                     color: isInstamart ? '#99226d' : '#fc8019',
                     borderColor: isInstamart ? '#99226d' : '#fc8019' 
                   }}
                 >
                   Help
                 </button>
              </div>
            </div>
          )
        })}
      </div>

      {activeHelpOrder && (
        <HelpChatbot 
          order={activeHelpOrder} 
          onClose={() => setActiveHelpOrder(null)} 
        />
      )}
    </>
  )
}

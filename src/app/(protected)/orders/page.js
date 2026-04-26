import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { Package, ShoppingBag, Heart, CreditCard, MapPin, Settings } from 'lucide-react'
import ClientOrdersList from './ClientOrdersList'
import './orders.css'

export default async function OrdersPage({ searchParams }) {
  const resolvedParams = await searchParams
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  if (session.user.role === 'vendor') {
    redirect('/vendor')
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: { 
      product: {
        include: { vendor: true }
      }
    },
    orderBy: { placedAt: 'desc' }
  })

  return (
    <div className="orders-container">
      {/* Swiggy Account Teal Hero */}
      <div className="orders-hero">
        <div className="hero-inner">
          <div className="user-info">
            <h1>{session.user.name}</h1>
            <p>{session.user.email} • {session.user.phone || '9876543210'}</p>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>

      <div className="orders-content-wrapper">
        <div className="dashboard-card">
          {/* Swiggy Sidebar */}
          <div className="dashboard-sidebar">
            <div className="sidebar-nav">
              <div className="nav-item active">
                <ShoppingBag size={18} />
                Orders
              </div>
            </div>
          </div>

          {/* Main Orders Content */}
          <div className="orders-main">
            <h2>Past Orders</h2>
            
            {orders.length === 0 ? (
              <div className="empty-orders">
                <Package size={64} color="#fc8019" />
                <h3 className="mt-4 font-bold text-xl">No orders yet</h3>
                <p className="text-gray-500 mt-2">Go ahead, order some yummy items from the menu.</p>
              </div>
            ) : (
              <ClientOrdersList orders={orders} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

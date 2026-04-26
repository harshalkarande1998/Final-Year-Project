import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MapPin, Phone, MessageSquare, Clock, ShieldCheck } from 'lucide-react'
import '../track.css'

export default async function TrackOrderPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const order = await prisma.order.findUnique({
    where: { id },
    include: { 
      product: {
        include: { vendor: true }
      }
    }
  })

  if (!order || order.customerId !== session.user.id) {
    redirect('/orders')
  }

  const steps = [
    { label: 'Confirmed', status: 'pending', icon: '✅' },
    { label: 'Preparing', status: 'preparing', icon: '🍳' },
    { label: 'On the Way', status: 'shipped', icon: '🛵' },
    { label: 'Delivered', status: 'delivered', icon: '🏠' }
  ]

  const currentStepIndex = steps.findIndex(s => s.status === order.status) === -1 
    ? 0 
    : steps.findIndex(s => s.status === order.status)

  return (
    <div className="track-container animate-fade-in">
      <Link href="/orders" className="flex items-center gap-2 text-[#686b78] hover:text-swiggy-orange font-bold mb-8 transition-colors">
        <ChevronLeft size={20} />
        Back to Orders
      </Link>

      <div className="track-card">
        {/* Progress Stepper */}
        <div className="stepper">
          {steps.map((step, i) => (
            <div key={i} className={`step ${i <= currentStepIndex ? 'completed' : ''} ${i === currentStepIndex ? 'active' : ''}`}>
              <div className="step-icon">
                {i < currentStepIndex ? '✓' : step.icon}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Simulated Map */}
        <div className="map-simulation">
          {/* Animated Route Line */}
          <div className="route-path"></div>
          
          {/* Vendor Location */}
          <div className="absolute top-[50%] left-[10%] -translate-y-1/2 text-center">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-2 border-2 border-swiggy-orange">
              <MapPin className="text-swiggy-orange" size={24} />
            </div>
            <p className="text-[10px] font-black text-[#282c3f] uppercase bg-white/80 px-2 py-1 rounded shadow-sm">Shop</p>
          </div>

          {/* Delivery Boy Avatar (Simulated) */}
          <div className="delivery-boy" style={{ left: `${10 + (currentStepIndex * 25)}%` }}>
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-[#60b246]">
                <span className="text-3xl">🛵</span>
              </div>
              <div className="pulse-dot -bottom-1 -right-1"></div>
            </div>
          </div>

          {/* Customer Location */}
          <div className="absolute top-[50%] right-[10%] -translate-y-1/2 text-center">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-2 border-2 border-gray-200">
              <MapPin className="text-gray-400" size={24} />
            </div>
            <p className="text-[10px] font-black text-[#282c3f] uppercase bg-white/80 px-2 py-1 rounded shadow-sm">Home</p>
          </div>
        </div>

        <div className="tracking-info">
          <div className="status-badge">
            {order.status === 'pending' ? 'Order Confirmed' : 
             order.status === 'preparing' ? 'Food is being prepared' :
             order.status === 'shipped' ? 'Valet is on the way' : 'Delivered'}
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-[#282c3f] mb-2">Arriving in 15 mins</h2>
              <p className="text-[#686b78] font-bold">Estimated delivery from {order.product.vendor?.shopName || 'the store'}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-[#93959f] uppercase tracking-widest mb-1">Order ID</p>
              <p className="font-bold text-[#282c3f]">#{order.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-[#f1f1f6]">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-swiggy-orange">
                   <Clock size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-[#93959f] uppercase">Time</p>
                   <p className="text-sm font-black">15-20 Mins</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                   <ShieldCheck size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-[#93959f] uppercase">Safety</p>
                   <p className="text-sm font-black">Contactless</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                   <MapPin size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-[#93959f] uppercase">Distance</p>
                   <p className="text-sm font-black">2.4 KM</p>
                </div>
             </div>
          </div>
        </div>

        <div className="track-footer">
          <div className="valet-card">
            <div className="valet-img">
               <span className="text-2xl">👨‍✈️</span>
            </div>
            <div>
              <h4 className="font-black text-lg">Harshal (Valet)</h4>
              <p className="text-xs text-white/60 font-bold uppercase tracking-wider">Top Rated Delivery Partner</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <Phone size={20} />
             </button>
             <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <MessageSquare size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MapPin, Phone, User, ClipboardList, CheckCircle2, CreditCard, Wallet, Banknote } from 'lucide-react'
import MockPaymentGateway from '@/components/MockPaymentGateway'
import './checkout.css'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [showPaymentGateway, setShowPaymentGateway] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    pincode: '',
    notes: ''
  })

  const [prevSessionName, setPrevSessionName] = useState(session?.user?.name)

  if (session?.user?.name !== prevSessionName) {
    setFormData(prev => ({ ...prev, fullName: session.user.name || '' }))
    setPrevSessionName(session.user.name)
  }

  useEffect(() => {
    fetch('/api/cart/list')
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(err => console.error(err))
  }, [])

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const deliveryFee = subtotal > 0 ? 40 : 0
  const tax = subtotal * 0.05
  const total = subtotal + deliveryFee + tax

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (paymentMethod !== 'COD') {
      setShowPaymentGateway(true)
      return
    }

    processOrder()
  }

  const processOrder = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paymentMethod })
      })

      if (res.ok) {
        router.push('/orders?success=1')
      } else {
        alert("Failed to process order.")
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <div className="checkout-container animate-fade-in">
      <h1 className="page-title">Checkout</h1>
      
      <div className="checkout-content">
        <div className="checkout-main-col">
          {/* User Account Section */}
          <div className="checkout-card user-account-card">
             <div className="card-header">
                <div className="header-icon-box">
                   <User size={20} />
                </div>
                <div>
                   <h2 className="card-title">Account</h2>
                   <p className="card-subtitle">Logged in as <strong>{session?.user?.name || 'User'}</strong></p>
                </div>
                <CheckCircle2 className="status-icon" size={24} />
             </div>
          </div>

          {/* Delivery Address Section */}
          <form onSubmit={handleSubmit} className="checkout-card delivery-card">
            <div className="card-header">
               <div className="header-icon-box orange">
                  <MapPin size={20} />
               </div>
               <div>
                  <h2 className="card-title">Delivery Address</h2>
                  <p className="card-subtitle">Where should we send your food?</p>
               </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input 
                    required
                    type="text" 
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input" 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input 
                    required
                    type="text" 
                    name="phone"
                    placeholder="Enter 10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input" 
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address Line</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <input 
                  required
                  type="text" 
                  name="addressLine"
                  placeholder="House No, Street, Area"
                  value={formData.addressLine}
                  onChange={handleChange}
                  className="form-input" 
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">City</label>
                <input 
                  required
                  type="text" 
                  name="city"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input" 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input 
                  required
                  type="text" 
                  name="pincode"
                  placeholder="6-digit code"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="form-input" 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Notes (Optional)</label>
              <div className="input-with-icon">
                <ClipboardList size={16} className="input-icon top" />
                <textarea 
                  name="notes"
                  placeholder="e.g. Ring the bell, leave at door..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input" 
                  rows="3"
                />
              </div>
            </div>

            {/* Payment Method Section inside the same flow */}
            <div className="payment-method-inline">
              <div className="card-header">
                <div className="header-icon-box purple">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="card-title">Payment Method</h2>
                  <p className="card-subtitle">Select how you&apos;d like to pay</p>
                </div>
              </div>

              <div className="payment-options">
                <div 
                  className={`payment-option ${paymentMethod === 'UPI' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  <Wallet size={20} className="pay-icon" />
                  <div className="pay-text">
                    <span className="pay-title">UPI</span>
                    <span className="pay-desc">GPay, PhonePe, Paytm</span>
                  </div>
                  <div className="radio-circle"></div>
                </div>

                <div 
                  className={`payment-option ${paymentMethod === 'CARD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('CARD')}
                >
                  <CreditCard size={20} className="pay-icon" />
                  <div className="pay-text">
                    <span className="pay-title">Credit / Debit Cards</span>
                    <span className="pay-desc">Visa, Mastercard, RuPay</span>
                  </div>
                  <div className="radio-circle"></div>
                </div>

                <div 
                  className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <Banknote size={20} className="pay-icon" />
                  <div className="pay-text">
                    <span className="pay-title">Cash on Delivery</span>
                    <span className="pay-desc">Pay with cash at your door</span>
                  </div>
                  <div className="radio-circle"></div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                paymentMethod === 'COD' ? 'Placing Order...' : 'Processing Payment...'
              ) : (
                paymentMethod === 'COD' ? 'Place Order' : `Pay ₹${total.toFixed(0)} & Order`
              )}
            </button>
          </form>
        </div>

        <div className="order-summary-col">
          <div className="checkout-card summary-card">
            <h2 className="card-title-sm">Order Summary</h2>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="item-qty-name">
                    <span className="qty-dot"></span>
                    <span className="summary-item-name">{item.product.name} x {item.quantity}</span>
                  </div>
                  <span className="summary-item-price">₹{(item.product.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-bill">
               <div className="bill-row">
                 <span>Item Total</span>
                 <span>₹{subtotal.toFixed(0)}</span>
               </div>
               <div className="bill-row">
                 <span>Delivery Fee</span>
                 <span>₹{deliveryFee.toFixed(0)}</span>
               </div>
               <div className="bill-row">
                 <span>Govt Taxes & Charges</span>
                 <span>₹{tax.toFixed(0)}</span>
               </div>
               <div className="bill-divider"></div>
               <div className="bill-row total">
                 <span>TO PAY</span>
                 <span>₹{total.toFixed(0)}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <MockPaymentGateway 
        isOpen={showPaymentGateway}
        total={total}
        method={paymentMethod}
        onConfirm={() => {
          setShowPaymentGateway(false)
          processOrder()
        }}
        onCancel={() => setShowPaymentGateway(false)}
      />
    </div>
  )
}

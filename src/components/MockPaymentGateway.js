'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, Lock, X, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function MockPaymentGateway({ isOpen, total, onConfirm, onCancel, method }) {
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setIsSuccess(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handlePay = () => {
    setLoading(true)
    // Simulate processing time
    setTimeout(() => {
      setLoading(false)
      setIsSuccess(true)
      // Show success for 2 seconds then confirm
      setTimeout(() => {
        onConfirm()
      }, 2000)
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-[90%] max-w-[450px] rounded-[32px] shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="payment-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Header */}
              <div className="bg-[#f8f9fb] p-6 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[#60b246]" size={24} />
                  <span className="font-black text-[#282c3f] uppercase tracking-tight">Secure Checkout</span>
                </div>
                {!loading && (
                  <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                  </button>
                )}
              </div>

              <div className="p-8 pb-10">
                <div className="text-center mb-8">
                   <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-1">Amount to Pay</p>
                   <h2 className="text-4xl font-black text-[#02060c]">₹{total.toFixed(2)}</h2>
                </div>

                {method === 'CARD' ? (
                  <div className="space-y-4">
                    <div className="payment-field">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="xxxx xxxx xxxx xxxx" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-4 bg-[#f1f1f6] border-none rounded-xl font-bold text-lg focus:ring-2 focus:ring-[#fc8019] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="payment-field">
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Expiry</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full p-4 bg-[#f1f1f6] border-none rounded-xl font-bold text-lg focus:ring-2 focus:ring-[#fc8019] outline-none"
                        />
                      </div>
                      <div className="payment-field">
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">CVV</label>
                        <input 
                          type="password" 
                          placeholder="***" 
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full p-4 bg-[#f1f1f6] border-none rounded-xl font-bold text-lg focus:ring-2 focus:ring-[#fc8019] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-[#f1f1f6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Image 
                        src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" 
                        alt="UPI" 
                        width={48} 
                        height={48} 
                        className="w-12 h-auto" 
                      />
                    </div>
                    <p className="font-bold text-[#282c3f]">Scan QR or Enter UPI ID</p>
                    <input 
                      type="text" 
                      placeholder="username@okaxis" 
                      className="w-full mt-4 p-4 bg-[#f1f1f6] border-none rounded-xl font-bold text-center text-lg focus:ring-2 focus:ring-[#fc8019] outline-none"
                    />
                  </div>
                )}

                <button 
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full mt-8 bg-[#fc8019] text-white p-5 rounded-2xl font-black text-lg uppercase tracking-wider shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Lock size={20} />
                      Confirm Payment
                    </>
                  )}
                </button>

                <p className="text-center mt-6 text-[11px] text-gray-400 font-bold flex items-center justify-center gap-1 uppercase">
                  <Lock size={12} />
                  128-bit SSL Encrypted Secure Payment
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 size={60} />
              </motion.div>
              <h2 className="text-3xl font-black text-[#02060c] mb-2">Payment Successful!</h2>
              <p className="text-gray-500 font-medium mb-8">Your transaction has been processed safely.</p>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-green-500"
                />
              </div>
              <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Redirecting you to orders...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

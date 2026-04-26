'use client'

import Navbar from '@/components/Navbar'
import { Check, Zap, Crown, Shield, Clock, Heart } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function MembershipPage() {
  const plans = [
    {
      name: 'Monthly',
      price: '₹149',
      period: '/month',
      description: 'Perfect for regular foodies',
      features: ['Unlimited Free Delivery', 'Extra 10% OFF on Dineout', 'No Surge Fees', 'Priority Support'],
      color: 'bg-orange-50',
      borderColor: 'border-orange-200',
      buttonColor: 'bg-swiggy-orange'
    },
    {
      name: 'Quarterly',
      price: '₹399',
      period: '/3 months',
      description: 'Our most popular choice',
      features: ['Unlimited Free Delivery', 'Extra 15% OFF on Dineout', 'No Surge Fees', 'Priority Support', 'Exclusive Genie Offers'],
      recommended: true,
      color: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      buttonColor: 'bg-indigo-600'
    },
    {
      name: 'Annual',
      price: '₹999',
      period: '/year',
      description: 'Maximum savings for pro users',
      features: ['Unlimited Free Delivery', 'Extra 20% OFF on Dineout', 'No Surge Fees', 'Priority Support', 'Exclusive Genie Offers', 'Zero Cancellation Fees'],
      color: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      buttonColor: 'bg-emerald-600'
    }
  ]

  return (
    <div className="min-h-screen bg-white font-sans text-swiggy-dark">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 py-10 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-swiggy-orange px-4 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest mb-4 md:mb-6"
          >
            <Crown size={14} />
            Introducing LocalSwig One
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[#02060c] mb-4 md:mb-6 tracking-tight leading-tight">
            One Membership,<br/><span className="text-swiggy-orange underline decoration-orange-200">Unlimited Benefits.</span>
          </h1>
          <p className="text-[#686b78] text-base md:text-xl max-w-2xl mx-auto font-medium px-4">
            Join the elite circle and save up to ₹500 on every order. Say goodbye to delivery fees and surge pricing forever.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {[
            { icon: <Zap />, title: 'Unlimited Free Delivery', desc: 'On all food orders above ₹149 and Instamart orders above ₹199.' },
            { icon: <Shield />, title: 'No Surge Pricing', desc: 'Rain or shine, peak hours or not—your delivery remains free and predictable.' },
            { icon: <Heart />, title: 'Extra Discounts', desc: 'Up to 30% additional discount on top of existing restaurant offers.' }
          ].map((benefit, i) => (
            <div key={i} className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-swiggy-orange shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-black text-[#02060c] mb-3">{benefit.title}</h3>
              <p className="text-[#686b78] font-medium leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Plans Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-black text-center mb-12">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div key={i} className={`relative p-10 rounded-[40px] border-2 ${plan.borderColor} ${plan.color} flex flex-col h-full overflow-hidden`}>
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest">
                    Best Value
                  </div>
                )}
                <h3 className="text-2xl font-black text-[#02060c] mb-2">{plan.name}</h3>
                <p className="text-sm font-bold text-[#686b78] mb-8">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-black text-[#02060c]">{plan.price}</span>
                  <span className="text-lg font-bold text-[#686b78]">{plan.period}</span>
                </div>

                <div className="space-y-4 mb-12 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Check size={12} className="text-green-600 font-bold" />
                      </div>
                      <span className="font-bold text-[#3d4152] text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all ${plan.buttonColor}`}>
                  Get LocalSwig One
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Policy Details */}
        <section className="bg-gray-50 rounded-[40px] p-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="text-swiggy-orange" />
            <h2 className="text-2xl font-black text-[#02060c]">Free Delivery Policy Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[#686b78] font-medium leading-loose">
            <ul className="list-disc pl-6 space-y-4">
              <li>Free delivery is applicable on all restaurants within a 10km radius of your location.</li>
              <li>A minimum order value of ₹149 is required to avail free delivery on Food.</li>
              <li>Instamart free delivery is applicable on orders above ₹199.</li>
              <li>Membership is strictly for personal use and cannot be shared across multiple devices.</li>
            </ul>
            <ul className="list-disc pl-6 space-y-4">
              <li>Surge fees are waived off for members even during extreme weather or high demand.</li>
              <li>Genie delivery discounts are applicable up to 5km distance.</li>
              <li>Membership can be cancelled within the first 24 hours if no benefits have been used.</li>
              <li>Renewal happens automatically unless cancelled 48 hours before expiry.</li>
            </ul>
          </div>
        </section>

        <div className="mt-16 text-center">
          <Link href="/" className="text-swiggy-orange font-black hover:underline underline-offset-4">
            Maybe later, take me back to home
          </Link>
        </div>
      </main>
    </div>
  )
}

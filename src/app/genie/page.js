'use client'

import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function GeniePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-swiggy-dark">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-48 h-48 bg-teal-50 rounded-full flex items-center justify-center text-8xl mb-8 shadow-inner"
        >
          📦
        </motion.div>
        
        <h1 className="text-5xl font-black text-[#02060c] mb-4 tracking-tight">Genie is coming soon!</h1>
        <p className="text-[#02060c99] text-xl max-w-2xl font-medium leading-relaxed mb-12">
          We&apos;re building a magical way to send and receive anything across your city. From documents to home-cooked meals, LocalSwig Genie will handle it all.
        </p>
        
        <div className="flex gap-4">
          <Link href="/" className="bg-swiggy-orange text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
            Back to Home
          </Link>
          <Link href="/food" className="bg-gray-100 text-[#02060c] px-8 py-4 rounded-2xl font-black text-lg hover:bg-gray-200 transition-colors">
            Order Food
          </Link>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[
            { title: 'Pick up & Drop', desc: 'Send keys, chargers or documents anywhere in the city.', icon: '📍' },
            { title: 'Buy from Any Store', desc: 'Get medicines, stationary or anything else you need.', icon: '🛒' },
            { title: 'Home to Home', desc: 'Share lunch boxes or gifts with your loved ones.', icon: '🏠' }
          ].map((feature, i) => (
            <div key={i} className="bg-teal-50/50 p-8 rounded-[32px] text-left border border-teal-100/50">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-black text-[#02060c] mb-2">{feature.title}</h3>
              <p className="text-[#02060c99] font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

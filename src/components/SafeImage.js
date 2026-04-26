'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Package } from 'lucide-react'

export default function SafeImage({ src, alt, fallback = '/uploads/landing_grocery_banner.png', className = "" }) {
  const [error, setError] = useState(false)

  // Handle case where src is null/undefined or specifically flagged as missing
  const imageSrc = (!src || error) ? fallback : src

  return (
    <div className={`relative w-full h-full bg-[#f9f9f9] flex items-center justify-center overflow-hidden ${className}`}>
      {(!src || error) ? (
        <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
           <Package size={48} strokeWidth={1} />
           <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Image</span>
           {/* Subtle background pattern to make it look "designed" */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
      ) : (
        <Image
          src={imageSrc}
          alt={alt || "Product image"}
          fill
          className={`object-cover transition-all duration-500 ${className}`}
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}

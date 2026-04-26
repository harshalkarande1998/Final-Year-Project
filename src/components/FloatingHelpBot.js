'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import HelpChatbot from './HelpChatbot'

export default function FloatingHelpBot() {
  const [isOpen, setIsOpen] = useState(false)

  // Mock order for general help if no specific order is selected
  const generalOrder = {
    id: 'GENERAL',
    status: 'SHOPPING',
    product: {
      name: 'Instamart Services',
      vendor: {
        shopName: 'Instamart Hub',
        storeType: 'INSTAMART'
      }
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#99226d] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[9998]"
      >
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <HelpChatbot 
          order={generalOrder} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  )
}

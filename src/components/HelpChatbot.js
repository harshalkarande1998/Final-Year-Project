'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Bot, User, MessageCircle } from 'lucide-react'

export default function HelpChatbot({ order, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', content: `Hi! I'm your LocalBiz assistant. How can I help you with your order from ${order.product.vendor?.shopName}?` }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const predefinedQuestions = [
    "Where is my order?",
    "How to cancel?",
    "Missing items",
    "Food quality issue"
  ]

  const getBotResponse = (question) => {
    const q = question.toLowerCase()
    if (q.includes('where')) {
      if (order.status === 'DELIVERED') return "Your order has already been delivered! Check your doorstep or contact the delivery partner if you can't find it."
      if (order.status === 'PENDING') return "The restaurant is currently preparing your delicious food. It will be out for delivery soon!"
      return `Your order is currently ${order.status.replace('_', ' ')}. Our delivery partner is on the way!`
    }
    if (q.includes('cancel')) {
      if (order.status === 'DELIVERED') return "Sorry, delivered orders cannot be cancelled."
      return "To cancel this order, please contact our support team at 1800-LOCALBIZ-HELP. Cancellation charges may apply if the restaurant has started preparing the food."
    }
    if (q.includes('missing') || q.includes('quality')) {
      return "We're very sorry to hear that. Please upload a photo of the bill and the food received, and we'll process a refund for you immediately."
    }
    return "I'm not sure about that. Would you like to speak to a human agent?"
  }

  const handleSend = (text) => {
    if (!text.trim()) return
    
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: getBotResponse(text) }])
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[520px] bg-white shadow-[0_10px_50px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden flex flex-col z-[9999] border border-gray-100 animate-slide-up">
      {/* Header */}
      <div className="bg-[#282c3f] p-5 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-swiggy-orange rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm">LocalBiz Assistant</h3>
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:rotate-90 transition-transform">
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-swiggy-orange text-white rounded-tr-none shadow-md' 
                : 'bg-white text-[#282c3f] rounded-tl-none border border-gray-100 shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="p-3 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
        {predefinedQuestions.map((q, idx) => (
          <button 
            key={idx} 
            onClick={() => handleSend(q)}
            className="px-4 py-2 bg-gray-100 text-[#282c3f] text-xs font-bold rounded-full whitespace-nowrap hover:bg-swiggy-orange hover:text-white transition-all border border-gray-200"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-swiggy-orange outline-none"
        />
        <button 
          onClick={() => handleSend(input)}
          className="w-12 h-12 bg-[#282c3f] text-white rounded-xl flex items-center justify-center hover:bg-black transition-all"
        >
          <Send size={20} />
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}

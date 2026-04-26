'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit2, Camera, X, Loader2 } from 'lucide-react'

export default function RestaurantHeaderClient({ restaurant }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    shopName: restaurant.shopName,
    address: restaurant.address || '',
    phone: restaurant.phone || '',
    storeType: restaurant.storeType
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(restaurant.image)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append('id', restaurant.id)
      data.append('shopName', formData.shopName)
      data.append('address', formData.address)
      data.append('phone', formData.phone)
      data.append('storeType', formData.storeType)
      if (selectedFile) {
        data.append('image', selectedFile)
      }

      const res = await fetch('/api/vendor/restaurant', {
        method: 'PUT',
        body: data
      })

      if (res.ok) {
        setIsEditing(false)
        router.refresh()
        // Force a small delay to ensure server state is captured
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        alert('Failed to update restaurant details')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred while updating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <Link href="/vendor" className="text-sm font-bold text-[#02060c99] hover:text-swiggy-orange transition-colors flex items-center gap-2 mb-4 w-max">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Hub
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="group relative w-24 h-24 rounded-2xl overflow-hidden shadow-md cursor-pointer bg-gray-100" onClick={() => setIsEditing(true)}>
                <Image 
                  src={restaurant.image || (restaurant.storeType === 'RESTAURANT' ? '/uploads/restaurant_banner.png' : '/uploads/grocery_veg.png')} 
                  alt={restaurant.shopName}
                  fill
                  className="object-cover group-hover:opacity-50 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-[#282c3f]" size={24} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#282c3f] tracking-tight">{restaurant.shopName}</h1>
                <p className="text-[#686b78] font-medium mt-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {restaurant.address || 'No Address'}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${restaurant.storeType === 'RESTAURANT' ? 'bg-orange-100 text-orange-700' : 'bg-pink-100 text-pink-700'}`}>
                    {restaurant.storeType}
                  </span>
                  <span className="text-sm font-bold text-[#686b78]">📞 {restaurant.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gray-100 text-[#282c3f] px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#282c3f] text-white">
              <h2 className="text-xl font-black">Edit Restaurant Profile</h2>
              <button onClick={() => setIsEditing(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Image Upload Area */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-lg border-4 border-gray-50 mb-4 group cursor-pointer" onClick={() => document.getElementById('profile-image-upload').click()}>
                    <Image src={previewUrl} alt="Preview" fill className="object-cover group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-gray-800" size={32} />
                    </div>
                  </div>
                  <input 
                    id="profile-image-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Click to change image</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Restaurant Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.shopName}
                      onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-[#282c3f] focus:ring-2 focus:ring-[#fc8019] outline-none"
                      placeholder="e.g. Punjabi Dhaba"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Type</label>
                    <select 
                      value={formData.storeType}
                      onChange={(e) => setFormData({...formData, storeType: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-[#282c3f] focus:ring-2 focus:ring-[#fc8019] outline-none appearance-none"
                    >
                      <option value="RESTAURANT">Restaurant</option>
                      <option value="INSTAMART">Instamart (Grocery)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Complete Address</label>
                    <textarea 
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-[#282c3f] focus:ring-2 focus:ring-[#fc8019] outline-none resize-none"
                      placeholder="e.g. Block A, New Sangavi, Pune"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-[#282c3f] focus:ring-2 focus:ring-[#fc8019] outline-none"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#fc8019', color: '#ffffff' }}
                    className="flex-1 px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </>
  )
}

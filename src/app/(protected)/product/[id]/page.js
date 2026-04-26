import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock } from 'lucide-react'
import AddToCartButton from './AddToCartButton'
import './product.css'

export default async function ProductPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { vendor: true, category: true }
  })

  if (!product) return notFound()

  return (
    <div className="product-page-wrapper animate-fade-in">
      <nav className="product-nav">
        <Link href={product.vendor.storeType === 'RESTAURANT' ? `/food/restaurant/${product.vendor.id}` : '/instamart'} className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
      </nav>
      
      <div className="product-layout">
        <div className="product-image-col">
           <div className="main-image-container">
              {product.image ? (
                 <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
              ) : (
                 <Image src={product.vendor.storeType === 'RESTAURANT' ? '/uploads/burger_icon.png' : '/uploads/landing_grocery_banner.png'} alt={product.name} fill style={{ objectFit: 'cover' }} />
              )}
           </div>
        </div>
        
        <div className="product-details-col">
          <div className="breadcrumb">
            {product.vendor.storeType === 'RESTAURANT' ? 'Food Delivery' : 'Instamart'} • {product.category?.name || 'Category'}
          </div>
          
          <h1 className="product-title">{product.name}</h1>
          <p className="product-weight">1 unit</p>
          
          <div className="delivery-time">
            <Clock size={16} /> 
            <span>{product.vendor.storeType === 'RESTAURANT' ? '30-40 mins' : '10 MINS'}</span> delivery time
          </div>
          
          <div className="price-section">
            <div className="price-current">₹{product.price.toFixed(2)}</div>
            <div className="price-tax">(Inclusive of all taxes)</div>
          </div>
          
          <div className="action-section">
            <AddToCartButton productId={product.id} />
          </div>
          
          <hr className="divider" />
          
          <div className="product-description">
            <h3>Product Details</h3>
            <p>{product.description || 'Premium quality product sourced locally to ensure freshness and taste.'}</p>
            
            <h4 className="mt-4">Sold By</h4>
            <p className="font-semibold text-gray-800">{product.vendor.shopName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

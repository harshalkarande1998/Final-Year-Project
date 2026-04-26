import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'
import CartBar from '@/components/CartBar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import RestaurantMenuClient from './RestaurantMenuClient'
import './menu.css'

export default async function RestaurantMenuPage({ params }) {
  const session = await getServerSession(authOptions)
  const resolvedParams = await params
  const { id } = resolvedParams

  const restaurant = await prisma.vendorProfile.findUnique({
    where: { id },
    include: {
      products: {
        include: { category: true }
      }
    }
  })

  if (!restaurant || restaurant.storeType !== 'RESTAURANT') {
    notFound()
  }

  // Fetch cart to show correct quantities and total price
  const cartItems = session ? await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true }
  }) : []

  // Only show cart bar if items are from THIS restaurant
  const currentStoreCart = cartItems.filter(item => item.product.vendorId === id)

  const cartMap = currentStoreCart.reduce((acc, item) => {
    acc[item.productId] = item.quantity
    return acc
  }, {})

  // Group products by category
  const groupedProducts = restaurant.products.reduce((acc, product) => {
    const catName = product.category ? product.category.name : 'Other'
    if (!acc[catName]) acc[catName] = []
    acc[catName].push(product)
    return acc
  }, {})

  return (
    <>
      <div className="menu-page-wrapper animate-fade-in">
        <nav className="food-nav">
           <Link href="/food" className="nav-brand">LocalSwig <span style={{color:'#f97316', fontWeight:400, fontSize:'1.2rem'}}>Food</span></Link>
        </nav>

        <div className="menu-container">
          <div className="breadcrumb-container">
            <Link href="/food" className="back-link">
              ← Home / {restaurant.address || 'Local'} / <span className="current-page">{restaurant.shopName}</span>
            </Link>
          </div>

          <div className="restaurant-header">
            <div className="restaurant-header-info">
              <h1 className="restaurant-name">{restaurant.shopName}</h1>
              <p className="restaurant-tags">North Indian, Chinese, Fast Food, Beverages</p>
              <p className="restaurant-address">{restaurant.address || 'Local Area'} ▼</p>
              
              <div className="restaurant-meta-pills">
                 <div className="meta-pill rating-pill">
                    <svg className="star-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span style={{fontWeight: 800}}>4.5</span>
                    <span style={{color: '#686b78', fontWeight: 600}}> (100+ ratings)</span>
                 </div>
                 <div className="meta-pill">
                    <span style={{fontWeight: 700}}>• 30-40 mins</span>
                 </div>
              </div>
            </div>
            <div className="restaurant-header-image">
               <Image 
                 src={restaurant.image || "/uploads/restaurant_banner.png"} 
                 alt={restaurant.shopName} 
                 fill 
                 style={{ objectFit: 'cover' }} 
               />
            </div>
          </div>

          <hr className="divider-line" />
          
          <div className="offers-scroll">
             <div className="offer-card">
                <div className="offer-title">FLAT ₹150 OFF</div>
                <div className="offer-desc">USE LOCAL150 | ABOVE ₹499</div>
             </div>
             <div className="offer-card">
                <div className="offer-title">20% OFF UPTO ₹50</div>
                <div className="offer-desc">USE TRYNEW | ABOVE ₹149</div>
             </div>
          </div>

          <hr className="divider-line-thick" />

          <RestaurantMenuClient 
            groupedProducts={groupedProducts} 
            cartMap={cartMap} 
          />
        </div>
      </div>
      <CartBar items={currentStoreCart} />
    </>
  )
}

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import CartList from './CartList'
import './cart.css'

export default async function CartPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  
  if (session.user.role === 'vendor') {
    return (
      <div className="cart-container">
        <h2>Vendors cannot use the cart.</h2>
      </div>
    )
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { 
      product: {
        include: { vendor: true }
      } 
    }
  })

  return (
    <div className="cart-container animate-fade-in">
      <h1 className="page-title">Your Cart</h1>
      <CartList initialItems={items} />
    </div>
  )
}

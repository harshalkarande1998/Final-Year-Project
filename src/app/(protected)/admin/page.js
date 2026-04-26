import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  // Check if role is admin
  if (session.user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-[calc(100vh-80px)]">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    )
  }

  // Fetch metrics
  const totalUsers = await prisma.user.count()
  const totalVendors = await prisma.vendorProfile.count()
  const totalOrders = await prisma.order.count()
  const totalProducts = await prisma.product.count()

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { placedAt: 'desc' },
    include: {
      customer: true,
      vendor: true,
      product: true
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[calc(100vh-80px)] animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 font-medium">System Overview & Oversight</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-8 rounded-3xl flex flex-col gap-2 shadow-sm bg-indigo-50 border border-indigo-100">
          <h3 className="font-bold text-base text-slate-500 uppercase tracking-widest">Total Users</h3>
          <p className="font-black text-5xl text-indigo-600">{totalUsers}</p>
        </div>
        <div className="p-8 rounded-3xl flex flex-col gap-2 shadow-sm bg-orange-50 border border-orange-100">
          <h3 className="font-bold text-base text-slate-500 uppercase tracking-widest">Active Vendors</h3>
          <p className="font-black text-5xl text-orange-600">{totalVendors}</p>
        </div>
        <div className="p-8 rounded-3xl flex flex-col gap-2 shadow-sm bg-emerald-50 border border-emerald-100">
          <h3 className="font-bold text-base text-slate-500 uppercase tracking-widest">Total Products</h3>
          <p className="font-black text-5xl text-emerald-600">{totalProducts}</p>
        </div>
        <div className="p-8 rounded-3xl flex flex-col gap-2 shadow-sm bg-pink-50 border border-pink-100">
          <h3 className="font-bold text-base text-slate-500 uppercase tracking-widest">Total Orders</h3>
          <p className="font-black text-5xl text-pink-600">{totalOrders}</p>
        </div>
      </div>

      <div className="dashboard-section bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Recent System Orders</h2>
        
        {recentOrders.length === 0 ? (
          <p className="text-slate-500">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-500">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Vendor</th>
                  <th className="pb-3 font-bold">Product</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-mono text-sm text-slate-500">...{order.id.slice(-6)}</td>
                    <td className="py-4 font-semibold text-slate-800">{order.customer.name || order.customer.email}</td>
                    <td className="py-4 font-semibold text-slate-800">{order.vendor?.shopName || 'N/A'}</td>
                    <td className="py-4 text-slate-600">{order.product.name} (x{order.quantity})</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-sm">{new Date(order.placedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

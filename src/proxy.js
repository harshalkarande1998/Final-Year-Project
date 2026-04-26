import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function proxy(req) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_only" 
  })
  
  const path = req.nextUrl.pathname

  if (token) {
    const role = token.role

    // Lock Vendors strictly into their portal
    if (role === 'vendor') {
      if (!path.startsWith('/vendor') && path !== '/login' && path !== '/register') {
        return NextResponse.redirect(new URL('/vendor', req.url))
      }
    }

    // Lock Admins strictly into their portal
    if (role === 'admin') {
      if (!path.startsWith('/admin') && path !== '/login' && path !== '/register') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    }
    
    // Lock Customers out of Vendor and Admin portals
    if (role === 'customer') {
      if (path.startsWith('/vendor') || path.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  } else {
    // Unauthenticated users trying to access protected routes
    if (
      path.startsWith('/vendor') || 
      path.startsWith('/admin') || 
      path.startsWith('/orders') || 
      path.startsWith('/cart') || 
      path.startsWith('/checkout')
    ) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
}

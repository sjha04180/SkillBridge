import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. If user is not logged in
    if (!token) {
      if (path.startsWith('/admin')) {
        if (path === '/admin/login') {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // 2. If user is logged in as Admin
    if (token.role === 'admin') {
      if (path.startsWith('/dashboard') || path === '/login') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      if (path === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    } 
    // 3. If user is logged in as Student/Other
    else {
      if (path.startsWith('/admin') && path !== '/admin/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Run middleware function for all dashboard and admin pages
        if (path === '/admin/login') return true;
        if (path.startsWith('/admin')) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = { 
  matcher: ["/dashboard/:path*", "/dashboard", "/admin/:path*", "/admin"] 
}

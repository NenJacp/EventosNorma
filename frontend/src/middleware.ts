import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('jwt');
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/verify-email') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password');
  const isProtectedRoute = 
    pathname.startsWith('/home') || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/events') || 
    pathname.startsWith('/all-events') || 
    pathname.startsWith('/profile') || 
    pathname.startsWith('/my-events') || 
    pathname.startsWith('/subscriptions') || 
    pathname.startsWith('/usuarios') || 
    pathname.startsWith('/catalog') || 
    pathname.startsWith('/categories');

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/home', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (static uploads)
     * - defaults (default images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|defaults).*)',
  ],
};

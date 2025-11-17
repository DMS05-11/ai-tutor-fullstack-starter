import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth-utils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/courses'];

  // Check if the current path is a protected route or starts with a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Allow access to public routes
  const publicRoutes = ['/sign-in', '/sign-up', '/verify', '/', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // If accessing a protected route, check authentication
  if (isProtectedRoute && !isPublicRoute) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirect to sign-in page with return URL
      const returnURL = encodeURIComponent(pathname);
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('returnUrl', returnURL);
      return NextResponse.redirect(signInUrl);
    }

    // Verify JWT token
    const payload = verifyJWT(token);
    if (!payload) {
      // Token is invalid, redirect to sign-in
      const returnURL = encodeURIComponent(pathname);
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('returnUrl', returnURL);
      return NextResponse.redirect(signInUrl);
    }
  }

  // If accessing auth routes while already authenticated, redirect to courses
  if (isPublicRoute && ['/sign-in', '/sign-up'].includes(pathname)) {
    const token = request.cookies.get('auth-token')?.value;
    if (token && verifyJWT(token)) {
      return NextResponse.redirect(new URL('/courses', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
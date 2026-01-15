import { NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/calculator',
  '/my-portfolio',
  '/alerts',
  '/settings',
];

// Routes that require admin authentication
const adminRoutes = [
  '/admin',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  // For demo purposes, we're not enforcing auth
  // In production, check for session cookie from Supabase
  
  if (isProtectedRoute) {
    // Check for session
    // const session = request.cookies.get('sb-access-token');
    // if (!session) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }
  
  if (isAdminRoute) {
    // Admin auth is handled client-side in the layout
    // Could also check server-side here
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};

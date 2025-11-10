import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/admin/sign-in(.*)',
  '/admin/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const isAdmin = sessionClaims?.metadata?.role === 'admin';
  const path = req.nextUrl.pathname;

  // Allow public routes (sign-in, sign-up) to pass through
  if (isPublicRoute(req)) {
    // If already logged in as admin, redirect away from sign-in
    if (userId && isAdmin && path.startsWith('/admin/sign-in')) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }
  
  // If not logged in and trying to access admin routes, redirect to sign-in
  if (!userId && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/sign-in', req.url));
  }

  // If user is logged in but not an admin, and tries to access /admin routes, redirect to access-denied
  if (userId && !isAdmin && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/access-denied', req.url));
  }

  // If trying to access admin dashboard or product page without being an admin, redirect to access-denied
  if ((path === '/admin/dashboard' || path === '/admin/product') && userId && !isAdmin) {
    return NextResponse.redirect(new URL('/admin/access-denied', req.url));
  }

  // If user is an admin and tries to access /admin, redirect to dashboard
  if (userId && isAdmin && path === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

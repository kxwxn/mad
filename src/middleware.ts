import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/admin/sign-in'])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next()
  
  const { userId, sessionClaims } = await auth();
    const isAdmin = sessionClaims?.metadata?.role === 'admin';
    const path = req.nextUrl.pathname;

  // If the user is logged in and is an admin, and tries to access sign-in page, redirect to dashboard
    if (userId && isAdmin && path === '/admin/sign-in') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // If the user is logged in but not an admin, and tries to access /admin, redirect to access-denied
    if (userId && !isAdmin && path.startsWith('/admin') && path !== '/admin/sign-in') {
      return NextResponse.redirect(new URL('/admin/access-denied', req.url));
    }

    // If trying to access admin dashboard or product page without being an admin, redirect to home
    if ((path === '/admin/dashboard' || path === '/admin/product') && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
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
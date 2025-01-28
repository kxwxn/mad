import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login');

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return null;
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }
}

export const config = {
  matcher: ['/admin/:path*']
};
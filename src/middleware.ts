// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
 function middleware(req) {
   // 대시보드 등 관리자 페이지 접근 시 인증 체크
   if (req.nextUrl.pathname.startsWith('/admin') && 
       req.nextUrl.pathname !== '/admin' && 
       !req.nextauth?.token?.role) {
     return NextResponse.redirect(new URL('/admin', req.url))
   }
 },
 {
   callbacks: {
     authorized: ({ token }) => !!token
   },
 }
)

export const config = {
 matcher: ["/admin/:path*"]
}
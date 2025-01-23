import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // 로그인하지 않은 상태에서 /admin/dashboard 등에 접근하면 /admin으로 리다이렉트
  if (!session && !window.location.pathname.endsWith('/admin')) {
    redirect('/admin');
  }

  // 이미 로그인한 상태에서 /admin에 접근하면 /admin/dashboard로 리다이렉트
  if (session?.user?.role === 'admin' && window.location.pathname.endsWith('/admin')) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
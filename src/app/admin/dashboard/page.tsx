import React from 'react';
import { Package, ShoppingCart, BarChart2, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-600">{session?.user?.email}</p>
        </div>
        
        <nav className="mt-4">
          <NavItem icon={<Package size={20} />} href="/admin/products" text="상품 관리" />
          <NavItem icon={<ShoppingCart size={20} />} href="/admin/orders" text="주문/배송 관리" />
          <NavItem icon={<BarChart2 size={20} />} href="/admin/stats" text="통계" />
          
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <LogOut size={20} className="mr-3" />
            <span>로그아웃</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            icon={<Package className="w-8 h-8 text-blue-500" />}
            title="상품 관리"
            description="상품 추가, 수정, 삭제"
            href="/admin/products"
          />
          <DashboardCard
            icon={<ShoppingCart className="w-8 h-8 text-green-500" />}
            title="주문/배송 관리"
            description="주문 현황 및 배송 상태"
            href="/admin/orders"
          />
          <DashboardCard
            icon={<BarChart2 className="w-8 h-8 text-purple-500" />}
            title="통계"
            description="매출 및 판매 통계"
            href="/admin/stats"
          />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, href, text }) => (
  <a
    href={href}
    className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </a>
);

const DashboardCard = ({ icon, title, description, href }) => (
  <a
    href={href}
    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-bold ml-3">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </a>
);

export default AdminDashboard;
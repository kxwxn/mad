import LoginForm from '@/components/admin/LoginForm';
import { redirect } from 'next/navigation';


export default function AdminLoginPage() {
 return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
     <LoginForm />
   </div>
 );
}

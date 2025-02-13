// app/(admin)/admin/(access-denied)/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function AdminAccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          관리자 전용 페이지
        </h1>
        <p className="text-gray-600 mb-6">
          죄송합니다. 이 페이지는 관리자만 접근할 수 있습니다.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          메인페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
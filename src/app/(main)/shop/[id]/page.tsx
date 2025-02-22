import ProductCard from "@/components/shop/ProductCard/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. 명확한 타입 정의
type PageParams = Promise<{ id: string }>;
type PageProps = { params: PageParams };

// 2. metadata 생성기
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product - ${id}`,
  };
}

// 3. 메인 페이지 컴포넌트
export default async function ProductPage({ params }: PageProps) {
  // 4. 모든 비동기 작업을 한번에 처리
  const [{ id }, cookieStore] = await Promise.all([
    params,
    Promise.resolve(cookies()) // cookies()의 Promise를 확실히 처리
  ]);
  
  // 5. Supabase 클라이언트 생성 및 데이터 조회
  const supabase = createClient(cookieStore);
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductCard product={product} />;
}
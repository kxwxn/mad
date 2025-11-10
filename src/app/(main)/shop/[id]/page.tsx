import ProductCard from "@/components/shop/ProductCard/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Product } from "@/types/product.types";

// 1. 명확한 타입 정의
type PageProps = {
  params: Promise<{ id: string }>;
};

// 2. metadata 생성기
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product - ${id}`,
  };
}

// 3. 메인 페이지 컴포넌트
export default async function ProductPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  // Product 타입으로 변환
  const productData: Product = {
    ...product,
    s: product.s || 0,
    m: product.m || 0,
    l: product.l || 0,
    os: product.os || 0,
    colors: product.colors || [],
  };

  return <ProductCard product={productData} />;
}
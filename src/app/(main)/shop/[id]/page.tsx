import ProductCard from "@/components/shop/ProductCard/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from 'next/navigation';


export default async function ProductPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductCard product={product} />;
}
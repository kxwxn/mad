import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 각 상품의 재고를 업데이트
    for (const item of items) {
      const { id, selectedSize, quantity } = item;
      
      // 현재 상품 정보 조회
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !product) {
        console.error(`Failed to fetch product ${id}:`, fetchError);
        continue;
      }

      // 선택된 사이즈의 현재 재고 확인 및 업데이트
      const sizeField = selectedSize.toLowerCase() === 'os' ? 'os' : selectedSize.toLowerCase();
      const currentStock = product[sizeField] || 0;
      const newStock = Math.max(0, currentStock - quantity);

      console.log(`Updating stock for product ${id}, size ${sizeField}: ${currentStock} -> ${newStock}`);

      // 재고 업데이트
      const { error: updateError } = await supabase
        .from("products")
        .update({ [sizeField]: newStock })
        .eq("id", id);

      if (updateError) {
        console.error(`Failed to update stock for product ${id}:`, updateError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stock update error:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }
} 
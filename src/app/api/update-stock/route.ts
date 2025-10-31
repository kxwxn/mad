import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

interface UpdateStockItem {
  id: string;
  selectedSize: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid items data", details: "Items must be a non-empty array" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const errors: string[] = [];

    for (const item of items) {
      const { id, selectedSize, quantity } = item as UpdateStockItem;

      // id가 문자열이거나 숫자 모두 허용 (빈 문자열은 제외)
      if (!id || (typeof id !== 'string' && typeof id !== 'number') || (typeof id === 'string' && id.length === 0)) {
        errors.push(`Invalid item data: missing or invalid id`);
        continue;
      }

      if (!selectedSize || typeof selectedSize !== 'string') {
        errors.push(`Invalid item data: missing or invalid selectedSize`);
        continue;
      }

      if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
        errors.push(`Invalid item data: invalid quantity`);
        continue;
      }

      // id는 문자열로 사용 (데이터베이스 id가 string 타입)
      const productId = String(id);

      // selectedSize를 데이터베이스 필드명으로 매핑
      // "OS" -> "os", "S" -> "s", "M" -> "m", "L" -> "l"
      const sizeUpper = selectedSize.toUpperCase().trim();
      let dbSizeField: 'os' | 's' | 'm' | 'l';
      
      if (sizeUpper === 'OS' || sizeUpper === 'ONESIZE' || sizeUpper === '') {
        dbSizeField = 'os';
      } else if (sizeUpper === 'S' || sizeUpper === '1') {
        dbSizeField = 's';
      } else if (sizeUpper === 'M' || sizeUpper === '2') {
        dbSizeField = 'm';
      } else if (sizeUpper === 'L' || sizeUpper === '3') {
        dbSizeField = 'l';
      } else {
        errors.push(`Invalid size format for product ${productId}: ${selectedSize}`);
        continue;
      }

      try {
        // 먼저 현재 제품 정보 가져오기 (모든 size 필드 가져오기)
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('id, s, m, l, os')
          .eq('id', productId)
          .single();

        if (fetchError || !product) {
          errors.push(`Failed to fetch product ${productId}: ${fetchError?.message || 'Product not found'}`);
          continue;
        }

        // 동적으로 해당 size 필드의 값 가져오기
        const currentStock = (product[dbSizeField] as number | null | undefined) ?? 0;
        const newStock = Math.max(0, currentStock - quantity);

        // 재고 업데이트
        const { error: updateError } = await supabase
          .from('products')
          .update({ [dbSizeField]: newStock })
          .eq('id', productId);

        if (updateError) {
          errors.push(`Failed to update stock for product ${productId}: ${updateError.message}`);
        }
      } catch (updateEx: unknown) {
        const message = updateEx instanceof Error ? updateEx.message : 'Unknown error';
        errors.push(`Exception during stock update for product ${productId}: ${message}`);
      }
    }

    if (errors.length > 0) {
      console.error('Failed to update stock:', errors);
      return NextResponse.json({ success: false, errors: errors }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: "Failed to update stock", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
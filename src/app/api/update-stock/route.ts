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
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const errors: string[] = [];

    for (const item of items) {
      const { id, selectedSize, quantity } = item as UpdateStockItem;

      if (!id || !selectedSize || typeof quantity !== 'number' || quantity <= 0) {
        errors.push(`Invalid item data: ${JSON.stringify(item)}`);
        continue;
      }

      const sizeField = selectedSize.toLowerCase() === 'os' ? 'os' : selectedSize.toLowerCase();

      try {
        // Supabase RPC를 사용하여 PostgreSQL 함수 호출
        const { error: rpcError } = await supabase.rpc('update_product_stock', {
          p_product_id: id,
          p_size_field: sizeField,
          p_quantity_to_decrease: quantity,
        });

        if (rpcError) {
          errors.push(`Failed to update stock for product ${id} (size: ${sizeField}, qty: ${quantity}): ${rpcError.message}`);
          console.error(`RPC Error for product ${id}:`, rpcError);
        }
      } catch (rpcEx: any) {
        errors.push(`Exception during stock update for product ${id}: ${rpcEx.message}`);
        console.error(`RPC Exception for product ${id}:`, rpcEx);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors: errors }, { status: 400 });
    } else {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Stock update error:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/supabase/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = parseInt(searchParams.get('from') || '0');
  const to = parseInt(searchParams.get('to') || '11');

  try {
    const products = await getProducts(from, to);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

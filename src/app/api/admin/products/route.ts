import { NextRequest, NextResponse } from 'next/server';
import { getAdminProducts } from '@/lib/supabase/adminProduct';
import { getErrorMessage, getErrorStatus } from '@/lib/errorHandling';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const from = fromParam ? parseInt(fromParam, 10) : undefined;
    const to = toParam ? parseInt(toParam, 10) : undefined;

    const products = await getAdminProducts(from, to);

    return NextResponse.json(products);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching admin products:', error);
    }
    const status = getErrorStatus(error);
    const message = getErrorMessage(error);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}


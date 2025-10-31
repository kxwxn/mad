import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/client';
import { getErrorMessage, getErrorStatus } from '@/lib/errorHandling';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = parseInt(searchParams.get('from') || '0');
    const to = parseInt(searchParams.get('to') || '7');

    const client = getServerClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching products:', error);
    }
    const status = getErrorStatus(error);
    const message = getErrorMessage(error);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

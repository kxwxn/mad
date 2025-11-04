import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/client';
import { getErrorMessage, getErrorStatus } from '@/lib/errorHandling';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = getServerClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching product:', error);
    }
    const status = getErrorStatus(error);
    const message = getErrorMessage(error);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}


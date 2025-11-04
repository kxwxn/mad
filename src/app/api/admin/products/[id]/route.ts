import { NextRequest, NextResponse } from 'next/server';
import { updateAdminProduct, deleteAdminProduct } from '@/lib/supabase/adminProduct';
import { getErrorMessage, getErrorStatus } from '@/lib/errorHandling';
import { Product } from '@/types/product.types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates = body.updates as Partial<Product>;

    if (!updates) {
      return NextResponse.json(
        { error: 'Updates are required' },
        { status: 400 }
      );
    }

    const updatedProduct = await updateAdminProduct(id, updates);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating admin product:', error);
    }
    const status = getErrorStatus(error);
    const message = getErrorMessage(error);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteAdminProduct(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting admin product:', error);
    }
    const status = getErrorStatus(error);
    const message = getErrorMessage(error);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}


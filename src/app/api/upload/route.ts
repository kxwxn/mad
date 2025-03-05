import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename is required' },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    const blob = await put(filename, file, {
      access: 'public',
      contentType: 'video/mp4',
    });

    return NextResponse.json(blob);
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
} 
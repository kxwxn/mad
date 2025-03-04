import { NextResponse } from 'next/server';
import { testSupabaseClient } from '@/lib/supabase/test';

export async function GET() {
  try {
    const result = await testSupabaseClient();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 
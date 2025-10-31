import { NextResponse } from 'next/server';
import { testSupabaseClient } from '@/lib/supabase/test';

/**
 * 테스트 API 엔드포인트
 * 개발 환경에서만 동작합니다.
 * 프로덕션에서는 404를 반환합니다.
 */
export async function GET() {
  // 프로덕션 환경에서는 테스트 API 접근 차단
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not Found' },
      { status: 404 }
    );
  }

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
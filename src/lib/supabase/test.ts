import { getClient } from './client';

export const testSupabaseClient = async () => {
  try {
    // 첫 번째 클라이언트 인스턴스 생성
    const client1 = getClient();
    
    // 두 번째 클라이언트 인스턴스 생성
    const client2 = getClient();
    
    // 두 인스턴스가 동일한지 확인
    const isSingleton = client1 === client2;
    
    // 간단한 쿼리 테스트
    const { data, error } = await client1
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    return {
      success: true,
      isSingleton,
      data,
      message: isSingleton 
        ? '싱글톤 패턴이 정상적으로 작동합니다.' 
        : '싱글톤 패턴이 제대로 작동하지 않습니다.'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      message: '테스트 중 오류가 발생했습니다.'
    };
  }
}; 
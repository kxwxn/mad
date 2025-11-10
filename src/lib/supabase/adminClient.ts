import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * 서버 사이드 전용 함수입니다.
 * Service Role Key는 절대 클라이언트에 노출되어서는 안 됩니다.
 * NEXT_PUBLIC_ 접두사가 없는 환경 변수만 사용하세요.
 */
export const getAdminClient = () => {
  if (!adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // 보안: NEXT_PUBLIC_ 접두사를 제거하여 서버 전용 환경 변수 사용
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase admin environment variables. Ensure SUPABASE_SERVICE_ROLE_KEY is set (not NEXT_PUBLIC_SERVICE_ROLE_KEY)');
    }

    adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
  }

  return adminClient;
}; 
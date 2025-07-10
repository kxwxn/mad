import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export const getAdminClient = () => {
  if (!adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase admin environment variables');
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
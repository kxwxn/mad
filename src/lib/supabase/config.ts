import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { getRequiredPublicEnv } from '@/utils/env';

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const supabase = () => {
  if (!supabaseInstance) {
    const supabaseUrl = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseAnonKey = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    supabaseInstance = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    );
  }
  return supabaseInstance;
};

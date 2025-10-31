import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { Database } from '@/types/database.types';
import { getRequiredPublicEnv } from '@/utils/env';

let serverInstance: ReturnType<typeof createServerClient<Database>> | null = null;

export const createClient = (cookieStore: ReadonlyRequestCookies) => {
  if (!serverInstance) {
    const supabaseUrl = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseAnonKey = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    serverInstance = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set(name, value, options);
            } catch (e) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Failed to set cookie:', e);
              }
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set(name, '', options);
            } catch (e) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Failed to remove cookie:', e);
              }
            }
          },
        },
      }
    );
  }
  return serverInstance;
}; 
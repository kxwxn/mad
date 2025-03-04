import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { Database } from '@/types/database.types';

let serverInstance: ReturnType<typeof createServerClient<Database>> | null = null;

export const createClient = (cookieStore: ReadonlyRequestCookies) => {
  if (!serverInstance) {
    serverInstance = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set(name, value, options);
            } catch (e) {
              console.error('Failed to set cookie:', e);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set(name, '', options);
            } catch (e) {
              console.error('Failed to remove cookie:', e);
            }
          },
        },
      }
    );
  }
  return serverInstance;
}; 
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import '@/lib/env-loader';

type CookieMethods = {
  getAll(): { name: string; value: string }[];
  setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]): void;
};

function lazyCookieMethods(): CookieMethods {
  return {
    getAll() {
      try {
        const cookieStore = cookies();
        return cookieStore.getAll();
      } catch {
        return [];
      }
    },
    setAll(cookiesToSet) {
      try {
        const cookieStore = cookies();
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options as never)
        );
      } catch {
        // No request context (e.g. Bolt preview runtime) or called from a
        // Server Component where setting cookies is not permitted.
      }
    },
  };
}

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: lazyCookieMethods() }
  );
}


import { createServerClient } from '@supabase/ssr';
import '@/lib/env-loader';

// For public, unauthenticated catalog reads only (categories/products are
// world-readable per RLS). Never touches cookies(), so it's safe to call
// from inside `unstable_cache` - the regular server client's cookie access
// would throw there, since Next disallows dynamic APIs inside a cache scope.
export function createPublicClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

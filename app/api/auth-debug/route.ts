import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  const cookieNames = allCookies.map(c => c.name);
  console.log('[AUTH-DEBUG-API] cookies received:', cookieNames);
  console.log('[AUTH-DEBUG-API] cookie count:', allCookies.length);

  const response = NextResponse.json({});

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  console.log('[AUTH-DEBUG-API] getUser:', { hasUser: !!user, error: error?.message });

  return NextResponse.json({
    cookieNames,
    cookieCount: allCookies.length,
    hasUser: !!user,
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    error: error?.message ?? null,
  });
}

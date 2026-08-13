import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import '@/lib/env-loader';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${params.locale}/admin-login`);
  }

  return <>{children}</>;
}

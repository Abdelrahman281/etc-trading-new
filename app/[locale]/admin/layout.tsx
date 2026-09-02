import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminHeader } from '@/components/admin/admin-header';
import '@/lib/env-loader';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${params.locale}/admin-login`);
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <AdminHeader locale={params.locale} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

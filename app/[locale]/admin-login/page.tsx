import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminLoginForm } from '@/components/admin/admin-login-form';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Admin');

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 font-barlow text-sm font-bold text-white">ETC</div>
          <div>
            <h1 className="font-barlow text-2xl font-bold text-navy-900">{t('login.title')}</h1>
            <p className="mt-1 text-sm text-navy-500">{t('login.subtitle')}</p>
          </div>
        </div>
        <AdminLoginForm locale={params.locale} />
      </div>
    </main>
  );
}

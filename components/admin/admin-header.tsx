import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LogoutButton } from '@/components/admin/logout-button';

export async function AdminHeader({ locale }: { locale: string }) {
  const t = await getTranslations('Admin');

  const navItems = [
    { href: `/${locale}/admin`, label: t('navDashboard') },
    { href: `/${locale}/admin/products`, label: t('navProducts') },
    { href: `/${locale}/admin/rfq`, label: t('navRfq') },
  ];

  return (
    <header className="border-b border-navy-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href={`/${locale}/admin`} className="font-barlow text-lg font-bold text-navy-900">
            {t('title')}
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} className="text-sm font-medium text-navy-500 hover:text-orange-600">
            {t('backToSite')}
          </Link>
          <LogoutButton locale={locale} />
        </div>
      </div>
    </header>
  );
}

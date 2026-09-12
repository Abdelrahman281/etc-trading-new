import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';

export default async function LocaleNotFound() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations('NotFound'),
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-orange-500 font-bold text-white">
        <span className="font-barlow text-xl font-bold">ETC</span>
      </div>
      <h1 className="mt-6 font-barlow text-4xl font-bold text-white">404</h1>
      <p className="mt-3 max-w-sm text-base text-navy-300">{t('message')}</p>
      <Link
        href={`/${locale}`}
        className="mt-6 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
      >
        {t('goHome')}
      </Link>
    </div>
  );
}

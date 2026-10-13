export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Layers, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { withTimeout } from '@/lib/with-timeout';
import { getCategoryIcon } from '@/lib/icons';
import { RetryButton } from '@/components/admin/retry-button';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Category } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return { title: t('adminCategories') };
}

export default async function AdminCategoriesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Admin')]);

  let categories: Category[] = [];
  let dbError = false;

  try {
    const supabase = createClient();
    const result = await withTimeout(
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      8000,
      'categories'
    );
    categories = (result.data ?? []) as Category[];
  } catch (err) {
    console.error('Admin categories page data fetch failed:', err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-medium text-red-600">{t('loadError')}</p>
        <RetryButton label={t('retry')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-barlow text-2xl font-bold text-navy-900">{t('categoriesTitle')}</h1>
        <p className="mt-1 text-sm text-navy-500">
          {t('categoriesDesc', { count: categories.length })}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
        <table className="hidden w-full text-start sm:table">
          <thead className="border-b border-navy-100 bg-navy-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('categoryCol')}</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('shortNameCol')}</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('orderCol')}</th>
              <th className="px-5 py-3 text-end text-xs font-semibold uppercase tracking-wider text-navy-500">{t('actionsCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon_name);
              return (
                <tr key={cat.id} className="transition-colors hover:bg-navy-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-navy-100 text-navy-500">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <Link
                        href={`/${locale}/admin/categories/${cat.id}/edit`}
                        className="text-sm font-semibold text-navy-900 hover:text-orange-600"
                      >
                        {cat.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-navy-500">{cat.short_name}</td>
                  <td className="px-5 py-3 text-sm text-navy-500">{cat.sort_order}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/admin/categories/${cat.id}/edit`}
                        className="text-xs font-medium text-orange-600 hover:text-orange-700"
                      >
                        {t('edit')}
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="divide-y divide-navy-50 sm:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/admin/categories/${cat.id}/edit`}
              className="block px-4 py-4"
            >
              <p className="text-sm font-semibold text-navy-900">{cat.name}</p>
              <p className="mt-1 text-xs text-navy-500">{cat.short_name}</p>
            </Link>
          ))}
        </div>
      </div>

      {categories.length === 0 && (
        <div className="rounded-xl border border-navy-100 bg-white p-12 text-center">
          <Layers className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-sm text-navy-500">{t('noCategories')}</p>
        </div>
      )}
    </div>
  );
}

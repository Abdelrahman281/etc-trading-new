export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { getCategories } from '@/lib/queries';
import { ProductForm } from '@/components/admin/product-form';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return { title: t('adminAddProduct') };
}

export default async function AdminNewProductPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Admin')]);
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}/admin/products`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToProducts')}
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
          <Plus className="h-5 w-5" />
        </div>
        <h1 className="font-barlow text-2xl font-bold text-navy-900">
          {t('addNewProduct')}
        </h1>
      </div>

      <div className="max-w-2xl rounded-xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
        <ProductForm categories={categories} mode="create" locale={locale} />
      </div>
    </div>
  );
}

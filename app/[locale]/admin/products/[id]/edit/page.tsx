export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import { getCategories, getProductById } from '@/lib/queries';
import { ProductForm } from '@/components/admin/product-form';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string; id: string } }): Promise<Metadata> {
  const t = await getTranslations('Admin');
  const product = await getProductById(params.id);
  if (!product) return { title: t('productNotFound') };
  return { title: t('editTitle', { name: product.name }) };
}

export default async function AdminEditProductPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Admin')]);
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(params.id),
  ]);

  if (!product) notFound();

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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
          <Pencil className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-barlow text-2xl font-bold text-navy-900">
            {t('editProduct')}
          </h1>
          <p className="mt-0.5 text-sm text-navy-500">{product.name}</p>
        </div>
      </div>

      <div className="max-w-2xl rounded-xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
        <ProductForm categories={categories} product={product} mode="edit" locale={locale} />
      </div>
    </div>
  );
}

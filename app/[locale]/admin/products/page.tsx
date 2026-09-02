export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus, Package, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategories } from '@/lib/queries';
import { getCategoryIcon } from '@/lib/icons';
import { createClient } from '@/lib/supabase/server';
import { withTimeout } from '@/lib/with-timeout';
import { DeleteProductButton } from '@/components/admin/delete-product-button';
import { RetryButton } from '@/components/admin/retry-button';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return { title: t('adminProducts') };
}

export default async function AdminProductsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Admin')]);

  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let products: { id: string; name: string; spec: string | null; category_id: string; sort_order: number; categories: { name: string; slug: string; icon_name: string | null } }[] = [];
  let dbError = false;

  try {
    categories = await withTimeout(getCategories(), 8000, 'getCategories');
    const supabase = createClient();
    const result = await withTimeout(
      supabase
        .from('products')
        .select('*, categories!inner(name, slug, icon_name)')
        .order('created_at', { ascending: false }),
      8000,
      'products'
    );
    products = (result.data ?? []) as typeof products;
  } catch (err) {
    console.error('Admin products page data fetch failed:', err);
    dbError = true;
  }

  // Fetch everything and filter in memory (catalog is small) so the
  // per-category chip counts stay accurate regardless of which filter,
  // if any, is currently applied.
  const allProducts = products;
  if (searchParams.category) {
    products = allProducts.filter((p) => p.categories.slug === searchParams.category);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-barlow text-2xl font-bold text-navy-900">{t('productsTitle')}</h1>
          <p className="mt-1 text-sm text-navy-500">
            {t('productsDesc', { count: allProducts.length })}
          </p>
        </div>
        <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
          <Link href={`/${locale}/admin/products/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addProduct')}
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/${locale}/admin/products`}
          className={`rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 hover:ring-orange-300 ${
            searchParams.category ? 'text-navy-600 ring-navy-200' : 'text-orange-600 ring-orange-300'
          }`}
        >
          {t('all', { count: allProducts.length })}
        </Link>
        {categories.map((cat) => {
          const count = allProducts.filter((p) => p.category_id === cat.id).length;
          const active = searchParams.category === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/${locale}/admin/products?category=${cat.slug}`}
              className={`rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 hover:ring-orange-300 ${
                active ? 'text-orange-600 ring-orange-300' : 'text-navy-600 ring-navy-200'
              }`}
            >
              {cat.short_name} ({count})
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
        <table className="hidden w-full text-left sm:table">
          <thead className="border-b border-navy-100 bg-navy-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('productCol')}</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('specCol')}</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('categoryCol')}</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('orderCol')}</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-navy-500">{t('actionsCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {products?.map((product) => {
              const Icon = getCategoryIcon(product.categories.icon_name);
              return (
                <tr key={product.id} className="transition-colors hover:bg-navy-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-navy-100 text-navy-500">
                        <Tag className="h-3.5 w-3.5" />
                      </div>
                      <Link
                        href={`/${locale}/admin/products/${product.id}/edit`}
                        className="text-sm font-semibold text-navy-900 hover:text-orange-600"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-navy-500">
                    {product.spec ?? t('noSpec')}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-navy-600">
                      <Icon className="h-3.5 w-3.5 text-orange-400" />
                      {product.categories.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-navy-500">{product.sort_order}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/admin/products/${product.id}/edit`}
                        className="text-xs font-medium text-orange-600 hover:text-orange-700"
                      >
                        {t('edit')}
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="divide-y divide-navy-50 sm:hidden">
          {products?.map((product) => {
            const Icon = getCategoryIcon(product.categories.icon_name);
            return (
              <div key={product.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${locale}/admin/products/${product.id}/edit`}
                    className="text-sm font-semibold text-navy-900"
                  >
                    {product.name}
                  </Link>
                  <DeleteProductButton
                    productId={product.id}
                    productName={product.name}
                  />
                </div>
                <p className="mt-1 text-xs text-navy-500">
                  {product.spec ?? t('noSpec')}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-navy-400">
                  <Icon className="h-3 w-3" />
                  {product.categories.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(!products || products.length === 0) && (
        <div className="rounded-xl border border-navy-100 bg-white p-12 text-center">
          <Package className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-sm text-navy-500">{t('noProducts')}</p>
          <Button asChild className="mt-4 bg-orange-500 text-white hover:bg-orange-600">
            <Link href={`/${locale}/admin/products/new`}>
              <Plus className="mr-2 h-4 w-4" />
              {t('addFirstProduct')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

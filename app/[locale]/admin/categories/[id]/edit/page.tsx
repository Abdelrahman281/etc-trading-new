export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/admin/category-form';
import { SubCategoryForm } from '@/components/admin/sub-category-form';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Category, SubCategory } from '@/lib/types';
import { DirectionalArrow } from '@/components/site/directional-arrow';

export async function generateMetadata({ params }: { params: { locale: string; id: string } }): Promise<Metadata> {
  const t = await getTranslations('Admin');
  const supabase = createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', params.id)
    .maybeSingle();
  if (!category) return { title: t('categoryNotFound') };
  return { title: t('editCategoryTitle', { name: category.name }) };
}

export default async function AdminEditCategoryPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Admin')]);
  const supabase = createClient();

  const [{ data: category }, { data: subCategories }] = await Promise.all([
    supabase.from('categories').select('*').eq('id', params.id).maybeSingle(),
    supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', params.id)
      .order('sort_order', { ascending: true }),
  ]);

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}/admin/categories`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-orange-600"
      >
        <DirectionalArrow direction="back" className="h-4 w-4" />
        {t('backToCategories')}
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
          <Pencil className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-barlow text-2xl font-bold text-navy-900">{t('editCategory')}</h1>
          <p className="mt-0.5 text-sm text-navy-500">{(category as Category).name}</p>
        </div>
      </div>

      <div className="max-w-3xl rounded-xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
        <CategoryForm category={category as Category} locale={locale} />
      </div>

      {subCategories && subCategories.length > 0 && (
        <div className="max-w-3xl space-y-4 rounded-xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-barlow text-lg font-semibold text-navy-900">{t('subCategoriesLabel')}</h2>
          <div className="space-y-4 divide-y divide-navy-50">
            {(subCategories as SubCategory[]).map((sub) => (
              <div key={sub.id} className="pt-4 first:pt-0">
                <SubCategoryForm subCategory={sub} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

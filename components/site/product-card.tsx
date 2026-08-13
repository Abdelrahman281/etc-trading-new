'use client';

import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getCategoryIcon } from '@/lib/icons';
import type { Category } from '@/lib/types';

export function ProductCard({
  category,
  index = 0,
  itemCount,
}: {
  category: Category;
  index?: number;
  itemCount?: number;
}) {
  const locale = useLocale();
  const t = useTranslations('Products');
  const Icon = getCategoryIcon(category.icon_name);

  return (
    <Link
      href={`/${locale}/products/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-xl hover:shadow-navy-900/10"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={category.image_url} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
        <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md shadow-orange-500/30 transition-transform duration-500 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="absolute bottom-3 left-4 right-4 font-barlow text-lg font-semibold text-white">{category.name}</h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-3 text-sm leading-relaxed text-navy-500">{category.description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600">
          <Package className="h-4 w-4" />
          {itemCount !== undefined ? itemCount : '—'} {t('items')}
          <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
      <span className="pointer-events-none absolute right-4 top-4 font-barlow text-xs font-semibold text-white/70">{String(index + 1).padStart(2, '0')}</span>
    </Link>
  );
}

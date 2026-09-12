import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getLocale } from 'next-intl/server';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export async function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const locale = await getLocale();
  // The separator chevron's glyph doesn't flip with the flex row's RTL
  // reversal, only its position does - so it has to be swapped explicitly to
  // keep pointing away from the current page toward the parent items.
  const Separator = locale === 'ar' ? ChevronLeft : ChevronRight;
  return (
    <div className="border-b border-navy-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-sm text-navy-500 sm:px-6 lg:px-8">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-orange-600">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-navy-900' : ''}>
                  {item.label}
                </span>
              )}
              {!isLast && <Separator className="h-3.5 w-3.5 text-navy-300" />}
            </span>
          );
        })}
      </div>
    </div>
  );
}

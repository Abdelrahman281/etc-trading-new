'use client';

import Link from 'next/link';
import {
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Package,
  Minus,
  Plus,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { Reveal } from '@/components/site/reveal';
import { useCart } from '@/lib/cart-context';
import { useLocale, useTranslations } from 'next-intl';

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations('Cart');
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const categoryCount = new Set(items.map((i) => i.categorySlug)).size;

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="bg-navy-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <Reveal>
              <div className="mx-auto max-w-lg rounded-2xl border border-navy-100 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-100">
                  <ShoppingCart className="h-10 w-10 text-navy-400" />
                </div>
                <h2 className="mt-6 font-barlow text-2xl font-bold text-navy-900">
                  {t('emptyTitle')}
                </h2>
                <p className="mt-3 text-base text-navy-500">
                  {t('emptyDesc')}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                    <Link href={`/${locale}/products`}>
                      {t('browseProducts')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-navy-200">
                    <Link href={`/${locale}/quote`}>
                      <FileText className="mr-2 h-4 w-4" />
                      {t('directQuote')}
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-barlow text-xl font-bold text-navy-900">
                    {t('itemsSelected', {
                      count: items.length,
                      item: items.length === 1 ? t('itemSingular') : t('itemPlural'),
                    })}
                  </h2>
                  <button
                    onClick={clearCart}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t('clearAll')}
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <Reveal key={item.id} delay={i * 40}>
                      <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-500">
                            <Package className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-navy-900">
                              {item.name}
                            </h3>
                            {item.spec && (
                              <p className="text-xs text-navy-400">{item.spec}</p>
                            )}
                            <Link
                              href={`/${locale}/products/${item.categorySlug}`}
                              className="mt-1 inline-block text-xs font-medium text-orange-600 hover:text-orange-700"
                            >
                              {item.category}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="rounded-md p-2 text-navy-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            aria-label={t('removeItem', { name: item.name })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {/* Quantity controls */}
                        <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-3">
                          <span className="text-xs font-medium text-navy-500">
                            {t('quantity')}
                          </span>
                          <div className="flex items-center gap-1 rounded-lg border border-navy-200 bg-navy-50">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-navy-600 transition-colors hover:bg-navy-200 disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              aria-label={t('decreaseQuantity')}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-semibold text-navy-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-navy-600 transition-colors hover:bg-navy-200"
                              aria-label={t('increaseQuantity')}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <div className="mt-6">
                  <Button asChild variant="outline" className="border-navy-200">
                    <Link href={`/${locale}/products`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('continueBrowsing')}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                  <h3 className="font-barlow text-lg font-semibold text-navy-900">
                    {t('quoteSummary')}
                  </h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-navy-500">{t('productLines')}</span>
                      <span className="font-semibold text-navy-900">{items.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-navy-500">{t('totalQuantity')}</span>
                      <span className="font-semibold text-navy-900">{totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-navy-500">{t('categories')}</span>
                      <span className="font-semibold text-navy-900">{categoryCount}</span>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-navy-100 pt-5">
                    <p className="text-xs text-navy-500">
                      {t('summaryNote')}
                    </p>
                  </div>
                  <Button
                    asChild
                    className="mt-5 w-full bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/25"
                  >
                    <Link href={`/${locale}/quote`}>
                      {t('proceedQuote')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-3 w-full border-navy-200"
                  >
                    <Link href={`/${locale}/products`}>
                      {t('addMoreProducts')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

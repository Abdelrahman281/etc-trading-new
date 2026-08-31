import Link from 'next/link';
import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Package, Tag, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { Reveal } from '@/components/site/reveal';
import { ProductCard } from '@/components/site/product-card';
import { DownloadCatalogSection } from '@/components/site/download-catalog-section';
import { getCategories, getCategoryWithDetails } from '@/lib/queries';
import { getCategoryIcon } from '@/lib/icons';
import type { CategoryWithDetails } from '@/lib/queries';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('productsTitle'),
    description: t('productsDescription'),
    alternates: { canonical: '/products' },
    openGraph: {
      title: t('productsOgTitle'),
      description: t('productsOgDescription'),
    },
  };
}

export default async function ProductsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Products')]);
  const categories = await getCategories();

  const categoriesWithDetails: CategoryWithDetails[] = [];
  for (const cat of categories) {
    const details = await getCategoryWithDetails(cat.slug);
    if (details) categoriesWithDetails.push(details);
  }

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Category cards */}
      <section className="bg-navy-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 flex items-center gap-3">
              <Package className="h-6 w-6 text-orange-500" />
              <h2 className="font-barlow text-2xl font-bold text-navy-900">
                {t('allCategories')}
              </h2>
              <span className="ml-auto text-sm text-navy-500">
                {t('categoriesCount', { count: categories.length })}
              </span>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((cat, i) => {
              const details = categoriesWithDetails.find((d) => d.slug === cat.slug);
              const itemCount = details
                ? details.subCategories.reduce(
                    (sum, sub) => sum + sub.products.length,
                    0
                  )
                : 0;
              return (
                <Reveal key={cat.slug} delay={i * 70}>
                  <ProductCard
                    category={cat}
                    index={i}
                    itemCount={itemCount}
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed breakdown per category */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('breakdownEyebrow')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('breakdownTitle')}
              </h2>
              <p className="mt-4 text-base text-navy-500">
                {t('breakdownSubtitle')}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 space-y-12">
            {categoriesWithDetails.map((cat, ci) => {
              const Icon = getCategoryIcon(cat.icon_name);
              return (
                <Reveal key={cat.slug} delay={ci * 60}>
                  <div className="rounded-2xl border border-navy-100 bg-navy-50 p-6 sm:p-8">
                    {/* Category header */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/25">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="font-barlow text-2xl font-bold text-navy-900">
                            {cat.name}
                          </h3>
                          <p className="mt-1 text-sm text-navy-500">{cat.description}</p>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="hidden shrink-0 border-orange-300 text-orange-600 hover:bg-orange-50 sm:inline-flex"
                      >
                        <Link href={`/${locale}/products/${cat.slug}`}>
                          {t('viewPage')}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* Sub-categories */}
                    {cat.subCategories && cat.subCategories.length > 0 && (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {cat.subCategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="rounded-lg border border-navy-100 bg-white p-4"
                          >
                            <h4 className="font-barlow text-sm font-semibold uppercase tracking-wide text-orange-600">
                              {sub.name}
                            </h4>
                            <ul className="mt-3 space-y-2">
                              {sub.products.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex flex-col gap-0.5"
                                >
                                  <div className="flex items-center gap-2">
                                    <Tag className="h-3 w-3 shrink-0 text-orange-400" />
                                    <span className="text-sm font-medium text-navy-700">
                                      {item.name}
                                    </span>
                                  </div>
                                  {item.spec && (
                                    <span className="ml-5 text-xs text-navy-400">
                                      {item.spec}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Brands */}
                    {cat.brands && cat.brands.length > 0 && (
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                          {t('brands')}
                        </span>
                        {cat.brands.map((brand) => (
                          <span
                            key={brand}
                            className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-navy-700 ring-1 ring-navy-200"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Mobile view page link */}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-5 w-full border-orange-300 text-orange-600 hover:bg-orange-50 sm:hidden"
                    >
                      <Link href={`/${locale}/products/${cat.slug}`}>
                        {t('viewPageShort', { name: cat.short_name })}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download Catalog */}
      <DownloadCatalogSection variant="dark" />

      {/* CTA */}
      <section className="bg-navy-50 py-16">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <h2 className="font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
              {t('ctaTitle')}
            </h2>
            <p className="mt-3 text-base text-navy-500">
              {t('ctaSubtitle')}
            </p>
          </div>
          <Button asChild size="lg" className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg">
            <Link href={`/${locale}/quote`}>
              {t('ctaButton')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

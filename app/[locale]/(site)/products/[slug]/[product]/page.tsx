import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  Tag,
  Package,
  CheckCircle2,
  Settings,
  Layers,
  Ruler,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { Reveal } from '@/components/site/reveal';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { AddToQuoteButton } from '@/components/site/add-to-quote-button';
import { DownloadCatalogSection } from '@/components/site/download-catalog-section';
import {
  getCategoryBySlug,
  getProductDetail,
  getProductsByCategory,
} from '@/lib/queries';
import { getCategoryIcon } from '@/lib/icons';
import { localized } from '@/lib/localized';
import { DirectionalArrow } from '@/components/site/directional-arrow';

export const dynamic = 'force-dynamic';

// No generateStaticParams here on purpose: this route is force-dynamic, so
// Next renders any product at request time regardless. Pre-listing params
// would call getAllProductSlugs() during the build step, and Vercel's build
// environment has a confirmed history of being unable to reach Supabase - a
// failed call there would cache an empty result for a week (see lib/queries.ts).

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string; product: string };
}): Promise<Metadata> {
  const t = await getTranslations('ProductDetail');
  const product = await getProductDetail(params.slug, params.product);
  if (!product) {
    return { title: t('productNotFound') };
  }
  const name = localized(product.name, product.nameAr, params.locale);
  return {
    title: `${name} | ETC Electromechanical Supply`,
    description: product.description,
    alternates: {
      canonical: `/products/${product.category}/${product.slug}`,
    },
    openGraph: {
      title: `${name} | ETC`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string; product: string };
}) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations('ProductDetail'),
  ]);

  const product = await getProductDetail(params.slug, params.product);
  if (!product) notFound();

  const category = await getCategoryBySlug(product.category);
  if (!category) notFound();

  const Icon = getCategoryIcon(category.icon_name);

  const relatedProducts = (await getProductsByCategory(category.id))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const specEntries = Object.entries(product.specifications);

  const productName = localized(product.name, product.nameAr, locale);
  const categoryName = localized(category.name, category.name_ar, locale);
  const categoryShortName = localized(category.short_name, category.short_name_ar, locale);
  const subcategoryName = localized(product.subcategory, product.subcategoryAr, locale);

  return (
    <>
      <PageHeader
        eyebrow={t('productDetailEyebrow')}
        title={productName}
        subtitle={product.description}
      />

      <Breadcrumbs
        items={[
          { label: t('home'), href: `/${locale}` },
          { label: t('products'), href: `/${locale}/products` },
          { label: categoryName, href: `/${locale}/products/${category.slug}` },
          { label: productName },
        ]}
      />

      {/* Hero */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <Reveal>
              {/* Source product photos are low-resolution (~250-350px); capping
                  the display box closer to their native size keeps the upscale
                  factor small instead of visibly pixelating a stretched image. */}
              <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-navy-100 bg-navy-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={productName}
                  className="h-64 w-full object-contain p-6 sm:h-72"
                />
                <div className="absolute start-4 top-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('overview')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {productName}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-500">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-navy-50 px-4 py-2.5">
                  <Tag className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-navy-700">
                    {t('category')}: {categoryName}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-navy-50 px-4 py-2.5">
                  <Package className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-navy-700">
                    {t('subcategory')}: {subcategoryName}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <AddToQuoteButton
                  item={{
                    name: product.name,
                    spec: product.description || undefined,
                    category: category.name,
                    categorySlug: category.slug,
                  }}
                  variant="default"
                  size="lg"
                  className="bg-orange-500 text-white hover:bg-orange-600"
                />
                <Button asChild size="lg" variant="outline" className="border-navy-200">
                  <Link href={`/${locale}/cart`}>
                    {t('viewQuoteCart')}
                    <DirectionalArrow direction="forward" className="ms-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-navy-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('productData')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('features')}
              </h2>
            </div>
          </Reveal>
          {product.features.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {product.features.map((feature, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div className="flex items-start gap-4 rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-relaxed text-navy-600">{feature}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-navy-400">
              {t('noFeatures')}
            </p>
          )}
        </div>
      </section>

      {/* Specifications */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('productData')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('specifications')}
              </h2>
            </div>
          </Reveal>
          {specEntries.length > 0 ? (
            <Reveal delay={100}>
              <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-navy-100 shadow-sm">
                <table className="w-full text-start">
                  <tbody className="divide-y divide-navy-100">
                    {specEntries.map(([label, value], i) => (
                      <tr key={label} className={i % 2 === 0 ? 'bg-navy-50' : 'bg-white'}>
                        <td className="w-1/3 px-6 py-4 text-sm font-semibold text-navy-900">
                          {label}
                        </td>
                        <td className="px-6 py-4 text-sm text-navy-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          ) : (
            <p className="mt-8 text-center text-sm text-navy-400">
              {t('noSpecifications')}
            </p>
          )}
        </div>
      </section>

      {/* Applications */}
      <section className="bg-navy-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('useCases')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('applications')}
              </h2>
            </div>
          </Reveal>
          {product.applications.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {product.applications.map((app, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div className="group h-full rounded-xl border border-navy-100 bg-white p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                      <Settings className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-medium leading-relaxed text-navy-700">
                      {app}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-navy-400">
              {t('noApplications')}
            </p>
          )}
        </div>
      </section>

      {/* Available Sizes */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('productData')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('availableSizes')}
              </h2>
            </div>
          </Reveal>
          {product.availableSizes.length > 0 ? (
            <Reveal delay={100}>
              <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
                {product.availableSizes.map((size, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-lg border border-navy-200 bg-navy-50 px-4 py-2.5 text-sm font-semibold text-navy-700"
                  >
                    <Ruler className="h-4 w-4 text-orange-500" />
                    {size}
                  </span>
                ))}
              </div>
            </Reveal>
          ) : (
            <p className="mt-8 text-center text-sm text-navy-400">{t('noSizes')}</p>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-navy-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-orange-500" />
                <h2 className="font-barlow text-2xl font-bold text-navy-900">
                  {t('relatedProducts', { name: categoryName })}
                </h2>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p, i) => {
                const relatedName = localized(p.name, p.name_ar, locale);
                return (
                <Reveal key={p.id} delay={i * 50}>
                  <Link
                    href={`/${locale}/products/${category.slug}/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="relative h-32 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image_url ?? ''}
                        alt={relatedName}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                      <h3 className="absolute bottom-2 start-3 end-3 font-barlow text-sm font-semibold text-white">
                        {relatedName}
                      </h3>
                    </div>
                    {p.spec && (
                      <p className="line-clamp-2 px-4 py-3 text-xs text-navy-500">
                        {p.spec}
                      </p>
                    )}
                  </Link>
                </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Download Catalog */}
      <DownloadCatalogSection variant="orange" />

      {/* CTA */}
      <section className="bg-navy-950 py-16">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-start lg:px-8">
          <div>
            <h2 className="font-barlow text-3xl font-bold text-white sm:text-4xl">
              {t('productCtaTitle')}
            </h2>
            <p className="mt-3 text-base text-navy-300">{t('productCtaSubtitle')}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg">
              <Link href="/cart">
                {t('viewQuoteCart')}
                <DirectionalArrow direction="forward" className="ms-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-600 bg-transparent text-white hover:bg-navy-800 hover:text-white"
            >
              <Link href={`/${locale}/products/${category.slug}`}>
                <DirectionalArrow direction="back" className="me-2 h-4 w-4" />
                {t('backToCategory', { name: categoryShortName })}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

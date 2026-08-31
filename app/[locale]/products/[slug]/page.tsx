import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Tag,
  Package,
  ArrowLeft,
  CheckCircle2,
  Download,
  Settings,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { Reveal } from '@/components/site/reveal';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { AddToQuoteButton } from '@/components/site/add-to-quote-button';
import { DownloadCatalogSection } from '@/components/site/download-catalog-section';
import { getCategories, getCategoryWithDetails } from '@/lib/queries';
import { getCategoryIcon } from '@/lib/icons';

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const t = await getTranslations('ProductDetail');
  const category = await getCategoryWithDetails(params.slug);
  if (!category) {
    return { title: t('productNotFound') };
  }
  return {
    title: `${category.name} | ETC Electromechanical Supply`,
    description: category.description,
    alternates: {
      canonical: `/products/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | ETC`,
      description: category.description,
      images: [{ url: category.image_url }],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('ProductDetail')]);
  const category = await getCategoryWithDetails(params.slug);

  if (!category) notFound();

  const Icon = getCategoryIcon(category.icon_name);
  const allCategories = await getCategories();
  const otherCategories = allCategories.filter((c) => c.slug !== params.slug);

  const totalItems = category.subCategories.reduce(
    (sum, sub) => sum + sub.products.length,
    0
  );

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={category.name}
        subtitle={category.description}
      />

      <Breadcrumbs
        items={[
          { label: t('home'), href: `/${locale}` },
          { label: t('products'), href: `/${locale}/products` },
          { label: category.name },
        ]}
      />

      {/* Hero banner */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="h-[320px] w-full object-cover sm:h-[400px]"
                />
                <div className="absolute left-4 top-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('overview')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {category.name}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-500">
                {category.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-navy-50 px-4 py-2.5">
                  <Package className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-navy-700">
                    {t('itemsAvailable', { count: totalItems })}
                  </span>
                </div>
                {category.brands && category.brands.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-navy-50 px-4 py-2.5">
                    <Tag className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium text-navy-700">
                      {t('brandsCount', { count: category.brands.length })}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {/* TODO: Replace href with real datasheet PDF URL when available */}
                <Button variant="outline" className="border-navy-200" asChild>
                  <a href="#" download>
                    <Download className="mr-2 h-4 w-4" />
                    {t('downloadDatasheet')}
                  </a>
                </Button>
                <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                  <Link href={`/${locale}/cart`}>
                    {t('viewQuoteCart')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features */}
      {category.features && category.features.length > 0 && (
        <section className="bg-navy-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  {t('whyChoose', { name: category.short_name })}
                </span>
                <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                  {t('keyFeatures')}
                </h2>
                <p className="mt-4 text-base text-navy-500">
                  {t('keyFeaturesSubtitle', { name: category.short_name })}
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {category.features.map((feature, i) => (
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
          </div>
        </section>
      )}

      {/* Technical Specifications */}
      {category.specifications && category.specifications.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  {t('productData')}
                </span>
                <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                  {t('techSpecs')}
                </h2>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-navy-100 shadow-sm">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-navy-100">
                    {category.specifications.map((spec, i) => (
                      <tr
                        key={spec.label}
                        className={i % 2 === 0 ? 'bg-navy-50' : 'bg-white'}
                      >
                        <td className="w-1/3 px-6 py-4 text-sm font-semibold text-navy-900">
                          {spec.label}
                        </td>
                        <td className="px-6 py-4 text-sm text-navy-600">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Applications */}
      {category.applications && category.applications.length > 0 && (
        <section className="bg-navy-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  {t('useCases')}
                </span>
                <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                  {t('commonApplications')}
                </h2>
                <p className="mt-4 text-base text-navy-500">
                  {t('commonApplicationsSubtitle', { name: category.short_name })}
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {category.applications.map((app, i) => (
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
          </div>
        </section>
      )}

      {/* Sub-categories with Add to Quote buttons */}
      {category.subCategories && category.subCategories.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  {t('productRange')}
                </span>
                <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                  {t('availableItems')}
                </h2>
                <p className="mt-4 text-base text-navy-500">
                  {t('availableItemsSubtitle')}
                </p>
              </div>
            </Reveal>

            <div className="mt-12 space-y-6">
              {category.subCategories.map((sub, si) => (
                <Reveal key={sub.id} delay={si * 60}>
                  <div className="rounded-2xl border border-navy-100 bg-navy-50 p-6 shadow-sm sm:p-8">
                    <h3 className="font-barlow text-xl font-bold text-navy-900">
                      {sub.name}
                    </h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {sub.products.map((item) => (
                        <Link
                          key={item.id}
                          href={`/${locale}/products/${category.slug}/${item.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-lg border border-navy-100 bg-white p-4 transition-colors hover:border-orange-200 hover:bg-navy-50"
                        >
                          <img
                            src={item.image_url ?? ''}
                            alt={item.name}
                            className="h-12 w-12 shrink-0 rounded-md object-cover"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Tag className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                              <span className="text-sm font-semibold text-navy-800 group-hover:text-orange-600">
                                {item.name}
                              </span>
                            </div>
                            {item.spec && (
                              <span className="ml-5.5 mt-1 block text-xs text-navy-400">
                                {item.spec}
                              </span>
                            )}
                          </div>
                          <AddToQuoteButton
                            item={{
                              name: item.name,
                              spec: item.spec ?? undefined,
                              category: category.name,
                              categorySlug: category.slug,
                            }}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {category.brands && category.brands.length > 0 && (
        <section className="bg-navy-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  {t('trustedManufacturers')}
                </span>
                <h2 className="mt-3 font-barlow text-2xl font-bold text-navy-900 sm:text-3xl">
                  {t('brandsWeCarry')}
                </h2>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {category.brands.map((brand) => (
                  <span
                    key={brand}
                    className="rounded-lg border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Related Products */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-3">
              <Layers className="h-6 w-6 text-orange-500" />
              <h2 className="font-barlow text-2xl font-bold text-navy-900">
                {t('relatedCategories')}
              </h2>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherCategories.map((cat, i) => {
              const OtherIcon = getCategoryIcon(cat.icon_name);
              return (
                <Reveal key={cat.slug} delay={i * 50}>
                  <Link
                    href={`/${locale}/products/${cat.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-navy-100 bg-navy-50 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                      <OtherIcon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-navy-800">
                      {cat.short_name}
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 text-navy-400 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download Catalog */}
      <DownloadCatalogSection variant="orange" />

      {/* CTA */}
      <section className="bg-navy-950 py-16">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <h2 className="font-barlow text-3xl font-bold text-white sm:text-4xl">
              {t('ctaTitle')}
            </h2>
            <p className="mt-3 text-base text-navy-300">
              {t('ctaSubtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg">
              <Link href="/cart">
                View Quote Cart
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-navy-600 bg-transparent text-white hover:bg-navy-800 hover:text-white">
              <Link href={`/${locale}/products`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('allProducts')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

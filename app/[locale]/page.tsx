import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Headset,
  Factory,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { ProductCard } from '@/components/site/product-card';
import { FeaturedProjectsSection } from '@/components/site/featured-projects-section';
import { IndustriesSection } from '@/components/site/industries-section';
import { DownloadCatalogSection } from '@/components/site/download-catalog-section';
import { companyInfo } from '@/lib/data';
import { getCategories, getFeaturedProducts } from '@/lib/queries';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'Metadata' });
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: { canonical: '/' },
    openGraph: {
      title: t('homeOgTitle'),
      description: t('homeOgDescription'),
      type: 'website',
    },
  };
}

const heroImage =
  'https://images.pexels.com/photos/36397942/pexels-photo-36397942.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const locale = await getLocale();
  const t = await getTranslations('Home');
  const productCategories = await getCategories();
  const featuredProducts = await getFeaturedProducts();

  const stats = [
    { value: '2016', label: t('statEstablished') },
    { value: '5+', label: t('statCategories') },
    { value: '30+', label: t('statProjects') },
    { value: '100%', label: t('statQuality') },
  ];

  const whyChoose = [
    {
      icon: ShieldCheck,
      title: t('whyChoose.qualityTitle'),
      description: t('whyChoose.qualityDesc'),
    },
    {
      icon: Truck,
      title: t('whyChoose.priceTitle'),
      description: t('whyChoose.priceDesc'),
    },
    {
      icon: Award,
      title: t('whyChoose.brandsTitle'),
      description: t('whyChoose.brandsDesc'),
    },
    {
      icon: Headset,
      title: t('whyChoose.teamTitle'),
      description: t('whyChoose.teamDesc'),
    },
  ];

  const introChecklist = [
    t('introChecklist.din'),
    t('introChecklist.quality'),
    t('introChecklist.sector'),
    t('introChecklist.team'),
  ];

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt="Industrial facility"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300">
              <Factory className="h-3.5 w-3.5" />
              {t('badge')}
            </div>
            <h1
              className="animate-fade-up mt-6 font-barlow text-4xl font-bold leading-[1.05] text-white text-balance sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '0.08s' }}
            >
              {t('title')}{' '}
              <span className="text-orange-500">{t('titleHighlight')}</span>
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-navy-200"
              style={{ animationDelay: '0.16s' }}
            >
              {t('subtitle')}
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: '0.24s' }}
            >
              <Button
                asChild
                size="lg"
                className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25"
              >
                <Link href={`/${locale}/quote`}>
                  {t('ctaQuote')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-navy-600 bg-navy-900/40 text-white backdrop-blur-sm hover:bg-navy-800 hover:text-white"
              >
                <Link href={`/${locale}/products`}>{t('ctaProducts')}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-orange-500/50 bg-orange-500/10 text-orange-300 backdrop-blur-sm hover:bg-orange-500/20 hover:text-orange-200"
              >
                <a href="/catalog/ETC-Catalog.pdf" download>
                  <Download className="mr-2 h-4 w-4" />
                  {t('ctaCatalog')}
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div
              className="animate-fade-up mt-12 grid grid-cols-2 gap-6 border-t border-navy-700/60 pt-8 sm:grid-cols-4"
              style={{ animationDelay: '0.32s' }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-barlow text-3xl font-bold text-orange-500">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-navy-300">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-navy-400">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-navy-600 p-1">
            <div className="h-2 w-1 animate-float rounded-full bg-orange-400" />
          </div>
        </div>
      </section>

      {/* ===== Intro ===== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.pexels.com/photos/8961133/pexels-photo-8961133.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Engineering team at work"
                    className="h-[420px] w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 hidden rounded-xl bg-orange-500 p-6 text-white shadow-xl sm:block">
                  <div className="font-barlow text-4xl font-bold">{companyInfo.founded}</div>
                  <div className="text-xs uppercase tracking-wider text-orange-100">{t('introEstablished')}</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('introEyebrow')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('introTitle')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-navy-500">
                {companyInfo.mission}
              </p>
              <p className="mt-4 text-base leading-relaxed text-navy-500">
                {companyInfo.staffNote}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {introChecklist.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-navy-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="bg-navy-900 text-white hover:bg-navy-800">
                  <Link href={`/${locale}/about`}>
                    {t('introLearnMore')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-navy-200 text-navy-700 hover:bg-navy-50"
                >
                  <a href="/catalog/ETC-Catalog.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    {t('ctaCatalog')}
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Product Categories ===== */}
      <section className="bg-navy-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('categoriesEyebrow')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('categoriesTitle')}
              </h2>
              <p className="mt-4 text-base text-navy-500">
                {t('categoriesSubtitle')}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {productCategories.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 80}>
                <ProductCard category={cat} index={i} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-navy-900 text-white hover:bg-navy-800">
                <Link href={`/${locale}/products`}>
                  {t('categoriesViewAll')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('featuredEyebrow')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('featuredTitle')}
              </h2>
              <p className="mt-4 text-base text-navy-500">
                {t('featuredSubtitle')}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <Reveal key={`${product.name}-${i}`} delay={i * 60}>
                <div className="group relative overflow-hidden rounded-xl border border-navy-100 bg-navy-50 transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-lg">
                  <div className="relative h-36 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image_url ?? ''}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {product.categoryName}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-barlow text-base font-semibold text-navy-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-navy-500">{product.spec}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="border-navy-200 text-navy-700 hover:bg-navy-50">
                <Link href={`/${locale}/products`}>
                  {t('featuredSeeFull')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Why Choose ETC ===== */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-24">
        <div className="bg-grid-dark absolute inset-0 opacity-40" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                {t('whyEyebrow')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold sm:text-4xl">
                {t('whyTitle')}
              </h2>
              <p className="mt-4 text-base text-navy-300">
                {t('whySubtitle')}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="group h-full rounded-xl border border-navy-700 bg-navy-900/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-orange-500/50 hover:bg-navy-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-barlow text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-300">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Featured Projects ===== */}
      <FeaturedProjectsSection />

      {/* ===== Industries We Serve ===== */}
      <IndustriesSection />

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden bg-orange-500 py-16">
        <div className="bg-grid-dark absolute inset-0 opacity-20" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <h2 className="font-barlow text-3xl font-bold text-white sm:text-4xl">
              {t('ctaTitle')}
            </h2>
            <p className="mt-3 text-base text-orange-100">
              {t('ctaSubtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-navy-950 text-white hover:bg-navy-900 shadow-lg"
            >
              <Link href={`/${locale}/quote`}>
                {t('ctaQuote')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
            >
              <a href="/catalog/ETC-Catalog.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                {t('ctaCatalog')}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

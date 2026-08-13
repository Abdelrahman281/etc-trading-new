import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Target, Eye, ShieldCheck, Users, Lightbulb, Handshake, Building2, MapPin, Download } from 'lucide-react';
import { getTranslations, getLocale, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { Reveal } from '@/components/site/reveal';
import { companyInfo, allProjects } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    alternates: { canonical: '/about' },
    openGraph: {
      title: t('aboutOgTitle'),
      description: t('aboutOgDescription'),
    },
  };
}

// Group projects by client for the reference list table
const projectGroups = [
  {
    client: 'Specialized Contracting Company (SIMCO)',
    projects: [
      'Power Station Project — New Administrative Capital & New Damietta',
      'Engineering Warehouses Project — New Administrative Capital',
      'Monorail Project — New Administrative Capital',
      'High One Project — Sheikh Zayed Area',
    ],
  },
  {
    client: 'Kortec — Hassan Allam Technology',
    projects: [
      'Ministry District — New Administrative Capital',
      'Zewail City — 6th of October City',
      'Bashteel Train Station — Giza Governorate',
      'Suez Stadium — Saint Catherine',
      'Sphinx International Airport',
    ],
  },
  {
    client: 'Hassan Allam Construction',
    projects: [
      'Towers of Alamein — Alamein City',
      'Bashteel Train Station — Giza Governorate',
    ],
  },
  {
    client: 'El Saadaa Company',
    projects: ['Al-Zomor Bridge', 'Al-Khayala Bridge', 'Al-Zeitoun Bridge'],
  },
  {
    client: 'Global Energy',
    projects: ['Benban Solar Power Station — Aswan Governorate'],
  },
  {
    client: 'TSK',
    projects: ['Benban Solar Power Station — Aswan Governorate'],
  },
  {
    client: 'Voltalia',
    projects: ['Benban Solar Power Station — Aswan Governorate'],
  },
  {
    client: 'ICPM — Investment Company for Production and Manufacturing',
    projects: [
      'Business District (Palm Hills) — New Administrative Capital',
      'British School — October City',
      'Ministry District — New Administrative Capital',
    ],
  },
  {
    client: 'Cairo Foam',
    projects: ['Cairo Foam Factory — Cold Room Manufacturing'],
  },
  {
    client: 'Volta Misr',
    projects: ['Volta Misr Factory'],
  },
  {
    client: 'Eva Pharma',
    projects: ['Eva Pharma Pharmaceutical Factory'],
  },
  {
    client: 'AMCO',
    projects: ['Hospital Works'],
  },
];

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const locale = await getLocale();
  const t = await getTranslations('About');

  const values = [
    {
      icon: ShieldCheck,
      title: t('values.qualityTitle'),
      description: t('values.qualityDesc'),
    },
    {
      icon: Lightbulb,
      title: t('values.techTitle'),
      description: t('values.techDesc'),
    },
    {
      icon: Handshake,
      title: t('values.priceTitle'),
      description: t('values.priceDesc'),
    },
    {
      icon: Users,
      title: t('values.staffTitle'),
      description: t('values.staffDesc'),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Story */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/18920790/pexels-photo-18920790.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Industrial facility"
                  className="h-[460px] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('whoEyebrow')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('whoTitle')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-navy-500">
                {companyInfo.mission}
              </p>
              <p className="mt-4 text-base leading-relaxed text-navy-500">
                {companyInfo.staffNote}
              </p>
              <p className="mt-4 text-base leading-relaxed text-navy-500">
                {t('whoRange')}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-navy-100 bg-navy-50 p-5">
                  <div className="font-barlow text-3xl font-bold text-orange-500">2016</div>
                  <div className="text-sm text-navy-500">{t('yearEstablished')}</div>
                </div>
                <div className="rounded-xl border border-navy-100 bg-navy-50 p-5">
                  <div className="font-barlow text-3xl font-bold text-orange-500">30+</div>
                  <div className="text-sm text-navy-500">{t('referenceProjects')}</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-navy-900 text-white hover:bg-navy-800">
                  <Link href={`/${locale}/contact`}>
                    {t('contactUs')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-navy-200">
                  <a href="/catalog/ETC-Catalog.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Catalog
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-navy-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-barlow text-2xl font-bold text-navy-900">{t('missionTitle')}</h3>
                <p className="mt-3 text-base leading-relaxed text-navy-500">
                  {t('missionText')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900 text-white">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-barlow text-2xl font-bold text-navy-900">{t('visionTitle')}</h3>
                <p className="mt-3 text-base leading-relaxed text-navy-500">
                  {/* TODO: Add official vision statement if provided by the company */}
                  {t('visionText')}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                {t('valuesEyebrow')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
                {t('valuesTitle')}
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 80}>
                  <div className="group h-full rounded-xl border border-navy-100 bg-navy-50 p-6 transition-all duration-500 hover:border-orange-200 hover:bg-white hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-barlow text-lg font-semibold text-navy-900">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-500">{v.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects / Reference List */}
      <section id="projects" className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-24">
        <div className="bg-grid-dark absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                {t('projectsEyebrow')}
              </span>
              <h2 className="mt-3 font-barlow text-3xl font-bold sm:text-4xl">
                {t('projectsTitle')}
              </h2>
              <p className="mt-4 text-base text-navy-300">
                {t('projectsSubtitle')}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {projectGroups.map((group, i) => (
              <Reveal key={group.client} delay={i * 50}>
                <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-barlow text-base font-semibold text-white">
                        {group.client}
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {group.projects.map((proj) => (
                          <li key={proj} className="flex items-start gap-2 text-sm text-navy-300">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
                            {proj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-16">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <h2 className="font-barlow text-3xl font-bold text-white sm:text-4xl">
              {t('ctaTitle')}
            </h2>
            <p className="mt-3 text-base text-orange-100">
              {t('ctaSubtitle')}
            </p>
          </div>
          <Button asChild size="lg" className="bg-navy-950 text-white hover:bg-navy-900 shadow-lg">
            <Link href={`/${locale}/contact`}>
              {t('contactUs')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

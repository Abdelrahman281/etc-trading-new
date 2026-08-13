import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  MessageCircle,
  Download,
  Clock,
  Building2,
  Calendar,
} from 'lucide-react';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { Reveal } from '@/components/site/reveal';
import { companyInfo } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  const locale = await getLocale();
  return {
    title: t('contactTitle'),
    description: t('contactDescription'),
    alternates: { canonical: `/${locale}/contact` },
    openGraph: {
      title: t('contactOgTitle'),
      description: t('contactOgDescription'),
    },
  };
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Contact');
  const navT = await getTranslations('Nav');
  const locale = await getLocale();

  const contactCards = [
    {
      icon: MapPin,
      title: t('visitUs'),
      lines: [companyInfo.address],
      action: { label: t('openMaps'), href: 'https://maps.google.com' },
    },
    {
      icon: Mail,
      title: t('emailUs'),
      lines: [companyInfo.email],
      action: { label: t('sendEmail'), href: `mailto:${companyInfo.email}` },
    },
    {
      icon: Phone,
      title: t('callUs'),
      lines: [companyInfo.phone],
      action: { label: t('callNow'), href: `tel:${companyInfo.phone}` },
    },
    {
      icon: MessageCircle,
      title: t('whatsapp'),
      lines: [companyInfo.phone],
      action: { label: t('startChat'), href: `https://wa.me/${companyInfo.whatsapp}` },
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Contact cards */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={i * 80}>
                  <div className="group h-full rounded-xl border border-navy-100 bg-navy-50 p-6 transition-all duration-500 hover:border-orange-200 hover:bg-white hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-barlow text-lg font-semibold text-navy-900">
                      {card.title}
                    </h3>
                    <div className="mt-2 space-y-1">
                      {card.lines.map((line) => (
                        <p key={line} className="text-sm text-navy-500">{line}</p>
                      ))}
                    </div>
                    {card.action && (
                      <a
                        href={card.action.href}
                        target={card.action.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
                      >
                        {card.action.label}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map + Business Info + Hours */}
      <section className="bg-navy-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Map placeholder */}
            <Reveal className="lg:col-span-2">
              <div className="relative h-[420px] overflow-hidden rounded-2xl border border-navy-100 bg-navy-100 shadow-sm">
                <div className="bg-grid absolute inset-0 opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 animate-float items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 font-barlow text-xl font-semibold text-navy-900">
                    {t('mapsPlaceholder')}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-navy-500">
                    {companyInfo.name}
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    {t('openGoogleMaps')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Business Info + Hours */}
            <Reveal delay={120}>
              <div className="flex h-full flex-col gap-6">
                {/* Business info */}
                <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-barlow text-lg font-semibold text-navy-900">
                      {t('businessInfo')}
                    </h3>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-navy-500">{t('company')}</dt>
                      <dd className="text-right font-medium text-navy-800">
                        {companyInfo.shortName}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-navy-500">{t('established')}</dt>
                      <dd className="text-right font-medium text-navy-800">
                        {companyInfo.founded}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-navy-500">{t('location')}</dt>
                      <dd className="text-right font-medium text-navy-800">{companyInfo.address}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-navy-500">{t('phone')}</dt>
                      <dd className="text-right">
                        <a href={`tel:${companyInfo.phone}`} className="font-medium text-orange-600 hover:text-orange-700">
                          {companyInfo.phone}
                        </a>
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-navy-500">{t('email')}</dt>
                      <dd className="text-right">
                        <a href={`mailto:${companyInfo.email}`} className="font-medium text-orange-600 hover:text-orange-700 break-all">
                          {companyInfo.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Working hours */}
                <div className="flex-1 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="font-barlow text-lg font-semibold text-navy-900">
                      {t('workingHours')}
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {companyInfo.hoursList.map((entry) => {
                      const isClosed = entry.time === 'Closed';
                      return (
                        <li
                          key={entry.day}
                          className="flex items-center justify-between gap-4 border-b border-navy-50 pb-2 last:border-0 last:pb-0"
                        >
                          <span className="flex items-center gap-2 text-navy-500">
                            <Calendar className="h-3.5 w-3.5 text-navy-400" />
                            {entry.day}
                          </span>
                          <span className={`font-medium ${isClosed ? 'text-red-500' : 'text-navy-800'}`}>
                            {isClosed ? t('closed') : entry.time}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WhatsApp + Quote CTA */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* WhatsApp */}
            <Reveal>
              <div className="h-full rounded-2xl bg-navy-950 p-8 text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366]">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-barlow text-xl font-semibold">
                  {t('chatWhatsapp')}
                </h3>
                <p className="mt-2 text-sm text-navy-300">
                  {t('whatsappDesc')}
                </p>
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1da851] sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t('startWhatsapp')}
                </a>
              </div>
            </Reveal>

            {/* Quote CTA */}
            <Reveal delay={100}>
              <div className="h-full rounded-2xl border border-navy-100 bg-navy-50 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-barlow text-xl font-semibold text-navy-900">
                  {t('quoteTitle')}
                </h3>
                <p className="mt-2 text-sm text-navy-500">
                  {t('quoteDesc')}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                    <Link href={`/${locale}/quote`}>
                      {t('quoteCta')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-navy-200">
                    <a href="/catalog/ETC-Catalog.pdf" download>
                      <Download className="mr-2 h-4 w-4" />
                      {navT('downloadCatalog')}
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

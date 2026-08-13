import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Download,
  Linkedin,
  Facebook,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { companyInfo } from '@/lib/data';
import { getCategories } from '@/lib/queries';

export async function Footer() {
  const t = await getTranslations('Footer');
  const tNav = await getTranslations('Nav');
  const productCategories = await getCategories();
  const locale = await getLocale();

  const quickLinks = [
    { label: tNav('home'), href: `/${locale}` },
    { label: tNav('about'), href: `/${locale}/about` },
    { label: tNav('products'), href: `/${locale}/products` },
    { label: tNav('quote'), href: `/${locale}/quote` },
    { label: tNav('contact'), href: `/${locale}/contact` },
  ];

  const socialLinks = [
    { icon: Linkedin, href: companyInfo.social.linkedin, label: 'LinkedIn' },
    { icon: Facebook, href: companyInfo.social.facebook, label: 'Facebook' },
    { icon: Instagram, href: companyInfo.social.instagram, label: 'Instagram' },
    { icon: MessageCircle, href: companyInfo.social.whatsapp, label: 'WhatsApp' },
  ];

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-100">
      <div className="bg-grid-dark absolute inset-0 opacity-40" />
      <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 font-bold text-white">
                <span className="font-barlow text-xl font-bold tracking-wide">ETC</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-barlow text-lg font-semibold tracking-wide text-white">
                  ETC TRADING
                </span>
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-orange-400">
                  & Engineering Co.
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-300">
              {t('description')}
            </p>

            {/* Social media */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-700 bg-navy-900 text-navy-300 transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm text-navy-200">{t('readyToSupply')}</span>
            </div>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-2">
            <h4 className="font-barlow text-sm font-semibold uppercase tracking-wider text-white">
              {t('productCategories')}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {productCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${locale}/products/${c.slug}`}
                    className="text-navy-300 transition-colors hover:text-orange-400"
                  >
                    {c.short_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-barlow text-sm font-semibold uppercase tracking-wider text-white">
              {t('quickLinks')}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-navy-300 transition-colors hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h4 className="font-barlow text-sm font-semibold uppercase tracking-wider text-white">
              {t('contactInfo')}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-orange-400" />
                <a href={`tel:${companyInfo.phone}`} className="text-navy-300 hover:text-orange-400">
                  {companyInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-orange-400" />
                <a href={`mailto:${companyInfo.email}`} className="text-navy-300 hover:text-orange-400 break-all">
                  {companyInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-orange-400" />
                <span className="text-navy-300">Egypt</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-orange-400" />
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-300 hover:text-orange-400"
                >
                  {t('whatsapp', { phone: companyInfo.phone })}
                </a>
              </li>
            </ul>

            {/* CTAs */}
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                {t('requestQuote')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="/catalog/ETC-Catalog.pdf"
                download
                className="inline-flex items-center justify-center gap-2 rounded-md border border-navy-700 px-4 py-2.5 text-sm font-semibold text-navy-200 transition-colors hover:border-orange-500 hover:text-white"
              >
                <Download className="h-4 w-4" />
                {t('downloadCatalog')}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 sm:flex-row">
          <p className="text-xs text-navy-400">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-navy-400">
            {t('tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}

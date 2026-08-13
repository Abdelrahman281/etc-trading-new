'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from '@/components/site/language-switcher';
import { companyInfo } from '@/lib/data';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();
  const t = useTranslations('Nav');
  const locale = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/quote`, label: t('quote') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const stripLocale = (path: string) => {
    const segs = path.split('/');
    if (segs[1] && ['en', 'ar'].includes(segs[1])) segs.splice(1, 1);
    return '/' + segs.filter(Boolean).join('/');
  };
  const currentPath = stripLocale(pathname);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-navy-900/95 shadow-lg shadow-navy-950/20 backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 font-bold text-white shadow-md shadow-orange-500/30 transition-transform group-hover:scale-105">
            <span className="font-barlow text-xl font-bold tracking-wide">ETC</span>
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-barlow text-lg font-semibold tracking-wide text-white">
              ETC TRADING
            </span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-orange-400">
              & Engineering Co.
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems
            .filter((l) => !l.href.endsWith('/quote'))
            .map((link) => {
              const active = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'text-orange-400'
                      : 'text-navy-100 hover:text-white'
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-orange-500" />
                  )}
                </Link>
              );
            })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            href={`/${locale}/cart`}
            className="relative rounded-md p-2 text-navy-100 transition-colors hover:text-white"
            aria-label={t('quoteCart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Button
            asChild
            size="lg"
            className="bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/25"
          >
            <Link href={`/${locale}/quote`}>
              {t('quote')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={t('toggleMenu')}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden bg-navy-900/98 backdrop-blur-md transition-all duration-300 lg:hidden',
          open ? 'max-h-96 border-t border-navy-700' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
          {navItems.map((link) => {
            const active = currentPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-4 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-navy-800 text-orange-400'
                    : 'text-navy-100 hover:bg-navy-800 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 flex items-center justify-between border-t border-navy-700 pt-3">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/cart`}
              className="mb-2 flex items-center justify-between rounded-md px-4 py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-800 hover:text-white"
            >
              {t('quoteCart')}
              {count > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
          <Button
            asChild
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            <Link href={`/${locale}/quote`}>
              {t('quote')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <a
            href={`tel:${companyInfo.phone}`}
            className="mt-2 px-4 py-2 text-center text-sm text-navy-200"
          >
            {companyInfo.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}

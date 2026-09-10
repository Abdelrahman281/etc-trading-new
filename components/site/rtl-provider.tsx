'use client';

import { useEffect, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { DirectionProvider } from '@radix-ui/react-direction';

export function RtlProvider({
  dir,
  children,
}: {
  dir: 'ltr' | 'rtl';
  children: ReactNode;
}) {
  // The root <html lang/dir> is set server-side from the request locale, but
  // switching locales client-side (router.push, no full page reload) doesn't
  // guarantee the root layout re-executes - Next.js can reuse it since it
  // sits above the [locale] segment. Keep <html> in sync imperatively too so
  // a client-side locale switch always updates direction, not just the
  // first (or a hard-refreshed) load.
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return <DirectionProvider dir={dir}>{children}</DirectionProvider>;
}

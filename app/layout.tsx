import type { ReactNode } from 'react';
import { Inter, Barlow_Condensed } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { CartProvider } from '@/lib/cart-context';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-barlow',
});

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${barlow.variable}`}>
      <body className="font-sans antialiased">
        {/* Reveal (components/site/reveal.tsx) fades content in via client JS;
            without it, this keeps that content visible instead of stuck at
            opacity-0 forever. */}
        <noscript>
          <style>{'.reveal-root { opacity: 1 !important; transform: none !important; }'}</style>
        </noscript>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

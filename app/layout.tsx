import type { ReactNode } from 'react';
import { Inter, Barlow_Condensed, Cairo } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { CartProvider } from '@/lib/cart-context';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-barlow',
});
// Inter and Barlow Condensed have no Arabic glyphs, so Arabic text was
// silently falling back to whatever default font the OS/browser picked -
// usually with a smaller-looking x-height than Inter at the same font-size.
// Cairo covers Arabic with a weight range matching both body and heading use.
const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-arabic',
});

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${barlow.variable} ${cairo.variable}`}
    >
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

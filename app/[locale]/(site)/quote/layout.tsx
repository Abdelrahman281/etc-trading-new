import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('quoteTitle'),
    description: t('quoteDescription'),
    alternates: { canonical: '/quote' },
    openGraph: { title: t('quoteOgTitle'), description: t('quoteOgDescription') },
  };
}

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

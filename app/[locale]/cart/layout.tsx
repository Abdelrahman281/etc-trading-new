import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('cartTitle'),
    description: t('cartDescription'),
    alternates: { canonical: '/cart' },
    robots: { index: false, follow: true },
  };
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}

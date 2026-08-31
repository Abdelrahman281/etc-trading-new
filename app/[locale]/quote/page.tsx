import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/site/page-header';
import { QuoteForm } from '@/components/site/quote-form';
import { getCategories } from '@/lib/queries';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('quoteTitle'),
    description: t('quoteDescription'),
    alternates: { canonical: '/quote' },
    openGraph: { title: t('quoteOgTitle'), description: t('quoteOgDescription') },
  };
}

export default async function QuotePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Quote');
  const categories = await getCategories();

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <QuoteForm categories={categories} />
    </>
  );
}

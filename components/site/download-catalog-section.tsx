import Link from 'next/link';
import { Download, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';

interface DownloadCatalogSectionProps {
  variant?: 'dark' | 'orange';
}

export function DownloadCatalogSection({
  variant = 'orange',
}: DownloadCatalogSectionProps) {
  const t = useTranslations('DownloadCatalog');
  const locale = useLocale();
  const isOrange = variant === 'orange';
  return (
    <section
      className={
        isOrange
          ? 'relative overflow-hidden bg-orange-500 py-16'
          : 'relative overflow-hidden bg-navy-950 py-16 text-white'
      }
    >
      <div className="bg-grid-dark absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
        <div className="flex items-center gap-5">
          <div
            className={
              isOrange
                ? 'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm'
                : 'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400'
            }
          >
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h2
              className={
                isOrange
                  ? 'font-barlow text-3xl font-bold text-white sm:text-4xl'
                  : 'font-barlow text-3xl font-bold text-white sm:text-4xl'
              }
            >
              {t('title')}
            </h2>
            <p
              className={
                isOrange
                  ? 'mt-3 text-base text-orange-100'
                  : 'mt-3 text-base text-navy-300'
              }
            >
              {t('subtitle')}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className={
              isOrange
                ? 'bg-navy-950 text-white hover:bg-navy-900 shadow-lg'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
            }
          >
            <a href="/catalog/ETC-Catalog.pdf" download>
              <Download className="mr-2 h-4 w-4" />
              {t('download')}
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className={
              isOrange
                ? 'border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white'
                : 'border-navy-600 bg-transparent text-white hover:bg-navy-800 hover:text-white'
            }
          >
            <Link href={`/${locale}/quote`}>
              {t('quote')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

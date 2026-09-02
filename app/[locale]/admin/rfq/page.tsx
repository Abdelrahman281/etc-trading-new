export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  FileText,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { getRfqRequests } from '@/lib/queries';
import { withTimeout } from '@/lib/with-timeout';
import { RetryButton } from '@/components/admin/retry-button';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return { title: t('adminRfq') };
}

const statusConfig = {
  new: { icon: AlertCircle, className: 'bg-blue-100 text-blue-700' },
  reviewed: { icon: Clock, className: 'bg-amber-100 text-amber-700' },
  quoted: { icon: CheckCircle2, className: 'bg-green-100 text-green-700' },
  closed: { icon: CheckCircle2, className: 'bg-navy-100 text-navy-600' },
} as const;

export default async function AdminRfqListPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Admin')]);

  let rfqRequests: Awaited<ReturnType<typeof getRfqRequests>> = [];
  let dbError = false;

  try {
    rfqRequests = await withTimeout(getRfqRequests(), 8000, 'getRfqRequests');
  } catch (err) {
    console.error('Admin RFQ list data fetch failed:', err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-medium text-red-600">{t('loadError')}</p>
        <RetryButton label={t('retry')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-barlow text-2xl font-bold text-navy-900">
          {t('rfqListTitle')}
        </h1>
        <p className="mt-1 text-sm text-navy-500">
          {t('rfqListDesc')}
        </p>
      </div>

      {rfqRequests.length === 0 ? (
        <div className="rounded-xl border border-navy-100 bg-white p-12 text-center shadow-sm">
          <FileText className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-sm text-navy-500">{t('noRfq')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
          {/* Desktop table */}
          <table className="hidden w-full text-left sm:table">
            <thead className="border-b border-navy-100 bg-navy-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('companyCol')}</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('contactCol')}</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('categoryCol')}</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('statusCol')}</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('dateCol')}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {rfqRequests.map((rfq) => {
                const status = statusConfig[rfq.status as keyof typeof statusConfig] ?? statusConfig.new;
                const StatusIcon = status.icon;
                return (
                  <tr key={rfq.id} className="transition-colors hover:bg-navy-50">
                    <td className="px-5 py-4">
                      <Link href={`/${locale}/admin/rfq/${rfq.id}`} className="text-sm font-semibold text-navy-900 hover:text-orange-600">
                        {rfq.company}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-navy-600">
                      {rfq.contact_person}
                      <div className="text-xs text-navy-400">{rfq.email}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-navy-600">{rfq.category}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {t(`status.${rfq.status as keyof typeof statusConfig}`)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-navy-500">
                      {new Date(rfq.created_at).toLocaleDateString(locale, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/${locale}/admin/rfq/${rfq.id}`} className="inline-flex items-center text-orange-600 hover:text-orange-700">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-navy-50 sm:hidden">
            {rfqRequests.map((rfq) => {
              const status = statusConfig[rfq.status as keyof typeof statusConfig] ?? statusConfig.new;
              const StatusIcon = status.icon;
              return (
                <Link
                  key={rfq.id}
                  href={`/${locale}/admin/rfq/${rfq.id}`}
                  className="block px-4 py-4 transition-colors hover:bg-navy-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy-900">{rfq.company}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                      <StatusIcon className="h-3 w-3" />
                      {t(`status.${rfq.status as keyof typeof statusConfig}`)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-navy-500">
                    {rfq.contact_person} · {rfq.category}
                  </p>
                  <p className="mt-0.5 text-xs text-navy-400">
                    {new Date(rfq.created_at).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

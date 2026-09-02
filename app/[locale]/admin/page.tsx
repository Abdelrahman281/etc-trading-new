export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  FileText,
  Package,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getRfqRequests, getCategories } from '@/lib/queries';
import { createClient } from '@/lib/supabase/server';
import { withTimeout } from '@/lib/with-timeout';
import { RetryButton } from '@/components/admin/retry-button';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return { title: t('adminDashboard') };
}

const statusConfig = {
  new: { icon: AlertCircle, className: 'bg-blue-100 text-blue-700' },
  reviewed: { icon: Clock, className: 'bg-amber-100 text-amber-700' },
  quoted: { icon: CheckCircle2, className: 'bg-green-100 text-green-700' },
  closed: { icon: CheckCircle2, className: 'bg-navy-100 text-navy-600' },
} as const;

export default async function AdminDashboardPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const [locale, t] = await Promise.all([getLocale(), getTranslations('Admin')]);

  let rfqRequests: Awaited<ReturnType<typeof getRfqRequests>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let productCount = 0;
  let dbError = false;

  try {
    [rfqRequests, categories] = await Promise.all([
      withTimeout(getRfqRequests(), 8000, 'getRfqRequests'),
      withTimeout(getCategories(), 8000, 'getCategories'),
    ]);
    const supabase = createClient();
    const countResult = await withTimeout(
      Promise.resolve(
        supabase.from('products').select('*', { count: 'exact', head: true })
      ),
      8000,
      'productCount'
    );
    productCount = countResult.count ?? 0;
  } catch (err) {
    console.error('Admin dashboard data fetch failed:', err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-medium text-red-600">
          {t('loadError')}
        </p>
        <RetryButton label={t('retry')} />
      </div>
    );
  }

  const newRfqCount = rfqRequests.filter((r) => r.status === 'new').length;
  const recentRfqs = rfqRequests.slice(0, 5);

  const stats = [
    {
      label: t('statsRfq'),
      value: rfqRequests.length,
      icon: FileText,
      href: `/${locale}/admin/rfq`,
      accent: 'bg-orange-500',
    },
    {
      label: t('statsNewRfq'),
      value: newRfqCount,
      icon: AlertCircle,
      href: `/${locale}/admin/rfq`,
      accent: 'bg-blue-500',
    },
    {
      label: t('statsProducts'),
      value: productCount,
      icon: Package,
      href: `/${locale}/admin/products`,
      accent: 'bg-navy-900',
    },
    {
      label: t('statsCategories'),
      value: categories.length,
      icon: Layers,
      href: `/${locale}/admin/products`,
      accent: 'bg-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-barlow text-2xl font-bold text-navy-900">{t('dashboard')}</h1>
        <p className="mt-1 text-sm text-navy-500">
          {t('dashboardDesc')}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-xl border border-navy-100 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.accent} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-navy-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" />
              </div>
              <p className="mt-4 font-barlow text-3xl font-bold text-navy-900">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-navy-500">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent RFQs */}
      <div className="rounded-xl border border-navy-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <h2 className="font-barlow text-lg font-semibold text-navy-900">
            {t('recentRfq')}
          </h2>
          <Link
            href={`/${locale}/admin/rfq`}
            className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            {t('viewAll')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentRfqs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-navy-300" />
            <p className="mt-3 text-sm text-navy-500">{t('noRfq')}</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-50">
            {recentRfqs.map((rfq) => {
              const status = statusConfig[rfq.status as keyof typeof statusConfig] ?? statusConfig.new;
              const StatusIcon = status.icon;
              return (
                <Link
                  key={rfq.id}
                  href={`/${locale}/admin/rfq/${rfq.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-navy-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-navy-900">
                        {rfq.company}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {t(`status.${rfq.status as keyof typeof statusConfig}`)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-navy-500">
                      {rfq.contact_person} · {rfq.category} ·{' '}
                      {new Date(rfq.created_at).toLocaleDateString(locale, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-navy-300" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

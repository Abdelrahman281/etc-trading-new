export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  Package,
  Calendar,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { getRfqRequestById } from '@/lib/queries';
import { withTimeout } from '@/lib/with-timeout';
import { RfqStatusUpdater } from '@/components/admin/rfq-status-updater';
import { RetryButton } from '@/components/admin/retry-button';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string; id: string } }): Promise<Metadata> {
  const t = await getTranslations('Admin');
  const rfq = await getRfqRequestById(params.id);
  if (!rfq) return { title: t('rfqNotFound') };
  return { title: t('rfqDetailTitle', { company: rfq.company }) };
}

export default async function AdminRfqDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Admin')]);

  let rfq: Awaited<ReturnType<typeof getRfqRequestById>> = null;
  let dbError = false;

  try {
    rfq = await withTimeout(getRfqRequestById(params.id), 8000, 'getRfqRequestById');
  } catch (err) {
    console.error('Admin RFQ detail data fetch failed:', err);
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

  if (!rfq) notFound();

  const infoItems = [
    { icon: Building2, label: t('companyCol'), value: rfq.company },
    { icon: User, label: t('contactCol'), value: rfq.contact_person },
    { icon: Phone, label: t('phone'), value: rfq.phone, href: `tel:${rfq.phone}` },
    { icon: Mail, label: t('email'), value: rfq.email, href: `mailto:${rfq.email}` },
    { icon: Package, label: t('categoryCol'), value: rfq.category },
    {
      icon: Calendar,
      label: t('dateCol'),
      value: new Date(rfq.created_at).toLocaleString(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={`/${locale}/admin/rfq`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToRfq')}
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-barlow text-2xl font-bold text-navy-900">
            {rfq.company}
          </h1>
          <p className="mt-1 text-sm text-navy-500">
            {t('rfqFrom', { contact: rfq.contact_person, email: rfq.email })}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-navy-400">
            {t('statusLabel')}
          </span>
          <div className="mt-1">
            <RfqStatusUpdater rfqId={rfq.id} currentStatus={rfq.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact info */}
        <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
          <h2 className="font-barlow text-lg font-semibold text-navy-900">
            {t('contactInfo')}
          </h2>
          <dl className="mt-4 space-y-4">
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-500">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wider text-navy-400">
                      {item.label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium text-navy-800">
                      {item.href ? (
                        <a href={item.href} className="text-orange-600 hover:text-orange-700">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Message + items */}
        <div className="space-y-6 lg:col-span-2">
          {/* Message */}
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <h2 className="font-barlow text-lg font-semibold text-navy-900">
                {t('message')}
              </h2>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-navy-600">
              {rfq.message}
            </p>
          </div>

          {/* Cart items */}
          {rfq.rfq_items && rfq.rfq_items.length > 0 && (
            <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                <h2 className="font-barlow text-lg font-semibold text-navy-900">
                  {t('requestedItems', { count: rfq.rfq_items.length })}
                </h2>
              </div>
              <div className="mt-4 overflow-hidden rounded-lg border border-navy-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-navy-50">
                    <tr>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('productCol')}</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('specCol')}</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-navy-500">{t('categoryCol')}</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-navy-500">{t('qtyCol')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {rfq.rfq_items.map((item) => (
                      <tr key={item.id} className="bg-white">
                        <td className="px-4 py-3 font-medium text-navy-800">
                          {item.product_name}
                        </td>
                        <td className="px-4 py-3 text-navy-500">
                          {item.spec ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-navy-500">{item.category}</td>
                        <td className="px-4 py-3 text-right font-semibold text-navy-900">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Send,
  AlertCircle,
  Package,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Reveal } from '@/components/site/reveal';
import { useCart } from '@/lib/cart-context';
import { useLocale, useTranslations } from 'next-intl';
import { submitRfq } from '@/lib/actions';
import { companyInfo } from '@/lib/data';
import type { Category } from '@/lib/types';

interface FormState {
  company: string;
  contact: string;
  phone: string;
  email: string;
  category: string;
  message: string;
}

interface FormErrors {
  company?: string;
  contact?: string;
  phone?: string;
  email?: string;
  category?: string;
  message?: string;
}

function buildCartMessage(
  items: { name: string; spec?: string; category: string; quantity: number }[]
): string {
  if (items.length === 0) return '';
  const lines = items.map(
    (i) =>
      `• ${i.name}${i.spec ? ` (${i.spec})` : ''} — Qty: ${i.quantity} — ${i.category}`
  );
  return `I would like to request a quotation for the following items:\n\n${lines.join('\n')}\n\nPlease provide pricing and availability. Thank you.`;
}

export function QuoteForm({ categories }: { categories: Category[] }) {
  const locale = useLocale();
  const t = useTranslations('Quote');
  const cartT = useTranslations('Cart');
  const { items, removeItem, clearCart } = useCart();
  const [form, setForm] = useState<FormState>({
    company: '',
    contact: '',
    phone: '',
    email: '',
    category: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [cartSnapshot, setCartSnapshot] = useState<
    { name: string; spec?: string; category: string; quantity: number }[]
  >([]);

  const prefilledRef = useRef(false);

  useEffect(() => {
    // CartProvider hydrates `items` from localStorage in its own effect, which
    // (being a parent) fires after this one on first mount — so `items` can
    // still be [] the first time this runs. Re-run on `items` changes but only
    // apply the prefill once, so later cart edits on this page don't stomp on
    // what the user has already typed.
    if (prefilledRef.current || items.length === 0) return;
    prefilledRef.current = true;

    setForm((f) => {
      if (f.message) return f;
      return { ...f, message: buildCartMessage(items) };
    });
    if (!form.category) {
      const firstCat = categories.find(
        (c) => c.slug === items[0].categorySlug
      );
      if (firstCat) {
        setForm((f) => ({ ...f, category: firstCat.name }));
      }
    }
    setCartSnapshot(items.map((i) => ({ ...i })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.company.trim()) e.company = t('errors.company');
    if (!form.contact.trim()) e.contact = t('errors.contact');
    if (!form.phone.trim()) e.phone = t('errors.phone');
    if (!form.email.trim()) {
      e.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t('errors.emailInvalid');
    }
    if (!form.category) e.category = t('errors.category');
    if (!form.message.trim()) e.message = t('errors.message');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    startTransition(async () => {
      const result = await submitRfq({
        company: form.company,
        contact_person: form.contact,
        phone: form.phone,
        email: form.email,
        category: form.category,
        message: form.message,
        items: items.map((i) => ({
          product_name: i.name,
          spec: i.spec ?? null,
          category: i.category,
          quantity: i.quantity,
        })),
      });

      if (result.success) {
        clearCart();
        setCartSnapshot(items.map((i) => ({ ...i })));
        setSubmitted(true);
      } else {
        setSubmitError(result.error ?? t('submitError'));
      }
    });
  };

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  if (submitted) {
    return (
      <>
        <section className="bg-navy-50 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="rounded-2xl border border-navy-100 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
                <h2 className="mt-6 font-barlow text-2xl font-bold text-navy-900">
                  {t('successTitle')}
                </h2>
                <p className="mt-3 text-base text-navy-500">
                  {t('successMessage', {
                    name: form.contact || 'valued customer',
                    category: form.category,
                    email: form.email,
                  })}
                </p>
                {cartSnapshot.length > 0 && (
                  <div className="mt-6 rounded-lg border border-navy-100 bg-navy-50 p-4 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                      {t('successItems', { count: cartSnapshot.length })}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {cartSnapshot.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm text-navy-600"
                        >
                          <span className="flex items-center gap-2">
                            <Package className="h-3.5 w-3.5 text-orange-400" />
                            {item.name}
                          </span>
                          <span className="font-medium">{cartT('quantity')}: {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        company: '',
                        contact: '',
                        phone: '',
                        email: '',
                        category: '',
                        message: '',
                      });
                    }}
                    className="bg-orange-500 text-white hover:bg-orange-600"
                  >
                    {t('submitAnother')}
                  </Button>
                  <Button asChild variant="outline" className="border-navy-200">
                    <Link href={`/${locale}`}>{t('backHome')}</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  return (
    <section className="bg-navy-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <Reveal className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
              noValidate
            >
              <h2 className="font-barlow text-2xl font-bold text-navy-900">
                {t('formTitle')}
              </h2>
              <p className="mt-2 text-sm text-navy-500">
                {t('requiredFields')} <span className="text-orange-500">*</span> {t('areRequired')}
              </p>

              {/* Cart items preview */}
              {items.length > 0 && (
                <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy-900">
                      {t('cartItems', {
                        count: items.length,
                        item: items.length === 1 ? cartT('itemSingular') : cartT('itemPlural'),
                      })}
                    </p>
                    <Link
                      href={`/${locale}/cart`}
                      className="text-xs font-medium text-orange-600 hover:text-orange-700"
                    >
                      {t('editCart')}
                    </Link>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-2 text-sm text-navy-600"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <Package className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                          <span className="truncate">{item.name}</span>
                          <span className="shrink-0 text-xs text-navy-400">
                            ({cartT('quantity')}: {item.quantity})
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded p-1 text-navy-400 hover:bg-red-50 hover:text-red-500"
                          aria-label={cartT('removeItem', { name: item.name })}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {submitError && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {submitError}
                </div>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="company">
                    {t('companyLabel')} <span className="text-orange-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    placeholder={t('companyPlaceholder')}
                    className={errors.company ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.company && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.company}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact">
                    {t('contactLabel')} <span className="text-orange-500">*</span>
                  </Label>
                  <Input
                    id="contact"
                    value={form.contact}
                    onChange={(e) => update('contact', e.target.value)}
                    placeholder={t('contactPlaceholder')}
                    className={errors.contact ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.contact && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.contact}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    {t('phoneLabel')} <span className="text-orange-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    className={errors.phone ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.phone && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    {t('emailLabel')} <span className="text-orange-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="category">
                    {t('categoryLabel')} <span className="text-orange-500">*</span>
                  </Label>
                  <Select value={form.category} onValueChange={(v) => update('category', v)}>
                    <SelectTrigger
                      id="category"
                      className={`w-full ${errors.category ? 'border-red-400 focus:ring-red-400' : ''}`}
                    >
                      <SelectValue placeholder={t('categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.slug} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="message">
                    {t('messageLabel')} <span className="text-orange-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder={t('messagePlaceholder')}
                    rows={6}
                    className={errors.message ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.message && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="mt-6 w-full bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/25"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t('submit')}
                  </>
                )}
              </Button>
            </form>
          </Reveal>

          {/* Sidebar */}
          <Reveal delay={120}>
            <div className="space-y-6">
              {items.length > 0 && (
                <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                  <h3 className="font-barlow text-lg font-semibold text-navy-900">
                    {t('cartSummary')}
                  </h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-navy-500">{cartT('productLines')}</span>
                      <span className="font-semibold text-navy-900">{items.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-navy-500">{cartT('totalQuantity')}</span>
                      <span className="font-semibold text-navy-900">
                        {items.reduce((s, i) => s + i.quantity, 0)}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="mt-4 w-full border-navy-200" size="sm">
                    <Link href={`/${locale}/cart`}>
                      {t('editQuoteCart')}
                    </Link>
                  </Button>
                </div>
              )}

              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                <h3 className="font-barlow text-lg font-semibold text-navy-900">
                  {t('whyQuote')}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-navy-600">
                  {[
                    t('whyQuoteReasons.pricing'),
                    t('whyQuoteReasons.custom'),
                    t('whyQuoteReasons.tech'),
                    t('whyQuoteReasons.fast'),
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-navy-950 p-6 text-white">
                <h3 className="font-barlow text-lg font-semibold">{t('preferToTalk')}</h3>
                <p className="mt-2 text-sm text-navy-300">
                  {t('preferToTalkDesc')}
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <a href={`tel:${companyInfo.phone}`} className="block text-orange-400 hover:text-orange-300">
                    {companyInfo.phone}
                  </a>
                  <a href={`mailto:${companyInfo.email}`} className="block text-orange-400 hover:text-orange-300">
                    {companyInfo.email}
                  </a>
                </div>
                <Button asChild className="mt-5 w-full bg-orange-500 text-white hover:bg-orange-600">
                  <Link href={`/${locale}/contact`}>
                    {t('contactUs')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

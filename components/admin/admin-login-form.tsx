'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export function AdminLoginForm({ locale }: { locale: string }) {
  const t = useTranslations('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message || t('login.invalidCredentials'));
      setIsSubmitting(false);
      return;
    }

    if (!data.session) {
      setError(t('login.invalidCredentials'));
      setIsSubmitting(false);
      return;
    }

    // Give the browser a tick to flush the auth cookies that signInWithPassword
    // just wrote, then hard-navigate so the server-side admin layout reads them.
    setTimeout(() => {
      window.location.href = `/${locale}/admin`;
    }, 100);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="admin-email" className="text-sm font-medium text-navy-700">
          {t('login.email')}
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm text-navy-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="text-sm font-medium text-navy-700">
          {t('login.password')}
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm text-navy-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? t('login.loggingIn') : t('login.submit')}
      </button>
    </form>
  );
}

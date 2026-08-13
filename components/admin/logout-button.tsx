'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations('Admin');

  async function handleLogout() {
    await createClient().auth.signOut();
    router.replace('/admin-login');
  }

  return (
    <button type="button" onClick={handleLogout} className="text-sm font-medium text-navy-500 transition-colors hover:text-orange-600">
      {t('logout')}
    </button>
  );
}

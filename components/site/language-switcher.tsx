'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (newLocale: string) => {
    if (newLocale === locale) return;
    // Replace the first segment (locale) in the path
    const segments = pathname.split('/');
    if (segments[1] && ['en', 'ar'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join('/') || `/${newLocale}`);
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Languages className="h-4 w-4 text-navy-200" />
      <button
        onClick={() => switchTo('en')}
        className={cn(
          'px-1.5 py-0.5 text-xs font-medium transition-colors',
          locale === 'en' ? 'text-orange-400' : 'text-navy-200 hover:text-white'
        )}
      >
        English
      </button>
      <span className="text-navy-600">|</span>
      <button
        onClick={() => switchTo('ar')}
        className={cn(
          'px-1.5 py-0.5 text-xs font-medium transition-colors',
          locale === 'ar' ? 'text-orange-400' : 'text-navy-200 hover:text-white'
        )}
      >
        العربية
      </button>
    </div>
  );
}

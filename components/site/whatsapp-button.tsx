'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '@/lib/data';
import { useTranslations } from 'next-intl';

export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  const t = useTranslations('WhatsApp');

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const href = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
    t('defaultMessage', { name: companyInfo.shortName })
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('chatLabel')}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-600/30 transition-all duration-500 hover:scale-110 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-16 opacity-0'
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}

'use client';

import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLocale } from 'next-intl';

// "forward" (continue/next/view more) points toward reading direction: right
// in English, left in Arabic. "back" is the reverse. Centralizing this avoids
// every CTA button re-deriving the flip from the current locale.
export function DirectionalArrow({
  direction = 'forward',
  className,
}: {
  direction?: 'forward' | 'back';
  className?: string;
}) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pointsLeft = direction === 'forward' ? isRtl : !isRtl;
  return pointsLeft ? (
    <ArrowLeft className={className} />
  ) : (
    <ArrowRight className={className} />
  );
}

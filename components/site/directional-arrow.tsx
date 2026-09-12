'use client';

import { ArrowRight, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLocale } from 'next-intl';

// "forward" (continue/next/view more) points toward reading direction: right
// in English, left in Arabic. "back" is the reverse. Centralizing this avoids
// every CTA button re-deriving the flip from the current locale.
export function DirectionalArrow({
  direction = 'forward',
  variant = 'arrow',
  className,
}: {
  direction?: 'forward' | 'back';
  variant?: 'arrow' | 'chevron';
  className?: string;
}) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pointsLeft = direction === 'forward' ? isRtl : !isRtl;
  if (variant === 'chevron') {
    return pointsLeft ? (
      <ChevronLeft className={className} />
    ) : (
      <ChevronRight className={className} />
    );
  }
  return pointsLeft ? (
    <ArrowLeft className={className} />
  ) : (
    <ArrowRight className={className} />
  );
}

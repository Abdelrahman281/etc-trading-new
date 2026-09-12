import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// `tel:` links should carry only a leading `+` and digits - a display string
// like "+20 122 726 6240" is fine to show, but not a strictly valid tel URI.
export function telHref(phone: string) {
  const trimmed = phone.trim();
  const plus = trimmed.startsWith('+') ? '+' : '';
  return `tel:${plus}${trimmed.replace(/\D/g, '')}`;
}

// Catalog content (category/product names) lives in the database as English
// with an optional Arabic counterpart. Falls back to English when no Arabic
// translation exists yet, e.g. for content added after this fix.
export function localized(
  en: string,
  ar: string | null | undefined,
  locale: string
): string {
  return locale === 'ar' && ar ? ar : en;
}

// Same idea for array-shaped content (feature/application bullet lists,
// specification label/value pairs).
export function localizedList<T>(
  en: T[],
  ar: T[] | null | undefined,
  locale: string
): T[] {
  return locale === 'ar' && ar && ar.length > 0 ? ar : en;
}

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale: string | undefined;
  try {
    locale = await requestLocale;
  } catch {
    // headers() may be unavailable in the Bolt preview runtime;
    // fall back to the default locale rather than crashing.
    locale = undefined;
  }
  if (!locale || !routing.locales.includes(locale as 'en' | 'ar')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

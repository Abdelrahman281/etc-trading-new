import { companyInfo } from '@/lib/data';
import { localized } from '@/lib/localized';
import { SITE_URL } from '@/lib/seo';
import type { Product } from '@/lib/types';
import type { BreadcrumbItem } from '@/components/site/breadcrumbs';

// Placeholder platform-homepage URLs (e.g. "https://www.linkedin.com" with no
// profile path) aren't real company profiles, so they're excluded from
// sameAs rather than published as if they were.
function realSocialLinks(): string[] {
  return Object.values(companyInfo.social).filter((url) => {
    try {
      return new URL(url).pathname.replace(/\/$/, '').length > 0;
    } catch {
      return false;
    }
  });
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyInfo.shortName,
    legalName: companyInfo.longName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    foundingDate: companyInfo.founded,
    email: companyInfo.email,
    telephone: companyInfo.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
    },
    ...(realSocialLinks().length > 0 ? { sameAs: realSocialLinks() } : {}),
  };
}

export function breadcrumbListSchema(
  items: BreadcrumbItem[],
  locale: string,
  currentPath: string
) {
  const withCurrentUrl = items.map((item, i) =>
    i === items.length - 1 && !item.href ? { ...item, href: currentPath } : item
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: withCurrentUrl.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}/${locale}${item.href}` } : {}),
    })),
  };
}

export function categoryItemListSchema(
  products: Product[],
  categorySlug: string,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: localized(product.name, product.name_ar, locale),
        ...(product.image_url ? { image: product.image_url } : {}),
        ...(product.spec ? { description: product.spec } : {}),
        brand: { '@type': 'Brand', name: companyInfo.shortName },
        url: `${SITE_URL}/${locale}/products/${categorySlug}`,
      },
    })),
  };
}

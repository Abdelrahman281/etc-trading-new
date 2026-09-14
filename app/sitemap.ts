import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getCategories, getAllProductSlugs } from '@/lib/queries';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, productSlugs] = await Promise.all([
    getCategories(),
    getAllProductSlugs(),
  ]);

  const staticPaths: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/products', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/quote', changeFrequency: 'monthly', priority: 0.6 },
  ];

  const categoryPaths = categories.map((category) => ({
    path: `/products/${category.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productPaths = productSlugs.map(({ category, product }) => ({
    path: `/products/${category}/${product}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const allPaths = [...staticPaths, ...categoryPaths, ...productPaths];

  return allPaths.flatMap(({ path, changeFrequency, priority }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency,
      priority,
    }))
  );
}

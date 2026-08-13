import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import { productCategories } from '@/lib/data';
import type { Category, Product, SubCategory, TechSpec } from '@/lib/types';

interface JsonProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  availableSizes: string[];
  datasheet: string | null;
  featured: boolean;
}

interface JsonCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

const jsonProducts = productsData as JsonProduct[];
const jsonCategories = categoriesData as JsonCategory[];

const staticMetaBySlug: Record<string, {
  icon_name: string;
  short_name: string;
  brands: string[];
  features: string[];
  specifications: TechSpec[];
  applications: string[];
}> = {};

for (const cat of productCategories) {
  staticMetaBySlug[cat.slug] = {
    icon_name: cat.icon.name,
    short_name: cat.shortName,
    brands: cat.brands ?? [],
    features: cat.features ?? [],
    specifications: cat.specifications ?? [],
    applications: cat.applications ?? [],
  };
}

function buildCategory(slug: string): Category {
  const jsonCat = jsonCategories.find((c) => c.slug === slug)!;
  const meta = staticMetaBySlug[slug];
  return {
    id: jsonCat.id,
    slug: jsonCat.slug,
    name: jsonCat.name,
    short_name: meta?.short_name ?? jsonCat.name,
    description: jsonCat.description,
    icon_name: meta?.icon_name ?? 'Package',
    image_url: jsonCat.image,
    brands: meta?.brands ?? [],
    features: meta?.features ?? [],
    specifications: meta?.specifications ?? [],
    applications: meta?.applications ?? [],
    sort_order: 0,
    created_at: '',
    updated_at: '',
  };
}

export function getCatalogCategories(): Category[] {
  return jsonCategories.map((c) => buildCategory(c.slug));
}

export function getCatalogCategoryBySlug(slug: string): Category | null {
  const jsonCat = jsonCategories.find((c) => c.slug === slug);
  if (!jsonCat) return null;
  return buildCategory(slug);
}

export function getCatalogProductsByCategory(categoryId: string): Product[] {
  return jsonProducts
    .filter((p) => p.category === categoryId)
    .map((p) => ({
      id: p.id,
      category_id: p.category,
      sub_category_id: p.subcategory,
      name: p.name,
      spec: p.description || null,
      sort_order: 0,
      created_at: '',
      updated_at: '',
      image: p.image,
      slug: p.slug,
      featured: p.featured,
    })) as Product[];
}

export function getCatalogProductBySlug(slug: string): (Product & { image: string; slug: string; featured: boolean }) | null {
  const p = jsonProducts.find((prod) => prod.slug === slug);
  if (!p) return null;
  return {
    id: p.id,
    category_id: p.category,
    sub_category_id: p.subcategory,
    name: p.name,
    spec: p.description || null,
    sort_order: 0,
    created_at: '',
    updated_at: '',
    image: p.image,
    slug: p.slug,
    featured: p.featured,
  };
}

export interface CatalogCategoryWithDetails extends Category {
  subCategories: (SubCategory & { products: Product[] })[];
}

export function getCatalogCategoryWithDetails(slug: string): CatalogCategoryWithDetails | null {
  const category = getCatalogCategoryBySlug(slug);
  if (!category) return null;

  const products = getCatalogProductsByCategory(category.id);

  const subNames = Array.from(new Set(products.map((p) => p.sub_category_id ?? 'Other')));

  const subCategories: (SubCategory & { products: Product[] })[] = subNames.map((name, i) => ({
    id: `${category.id}-sub-${i}`,
    category_id: category.id,
    name,
    sort_order: i,
    products: products.filter((p) => (p.sub_category_id ?? 'Other') === name),
  }));

  return {
    ...category,
    subCategories,
  };
}

export interface CatalogProductDetail {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  subcategory: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  availableSizes: string[];
  datasheet: string | null;
  featured: boolean;
}

export function getCatalogProductDetail(
  categorySlug: string,
  productSlug: string
): CatalogProductDetail | null {
  const product = jsonProducts.find(
    (p) => p.slug === productSlug && p.category === categorySlug
  );
  if (!product) return null;
  const category = getCatalogCategoryBySlug(product.category);
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    categoryName: category?.name ?? product.category,
    subcategory: product.subcategory,
    description: product.description,
    image: product.image,
    images: product.images,
    features: product.features,
    specifications: product.specifications,
    applications: product.applications,
    availableSizes: product.availableSizes,
    datasheet: product.datasheet,
    featured: product.featured,
  };
}

export function getCatalogAllProductSlugs(): { category: string; product: string }[] {
  return jsonProducts.map((p) => ({ category: p.category, product: p.slug }));
}

export function getCatalogFeaturedProducts(): (Product & { image: string; slug: string; featured: boolean })[] {
  return jsonProducts
    .filter((p) => p.featured)
    .map((p) => ({
      id: p.id,
      category_id: p.category,
      sub_category_id: p.subcategory,
      name: p.name,
      spec: p.description || null,
      sort_order: 0,
      created_at: '',
      updated_at: '',
      image: p.image,
      slug: p.slug,
      featured: p.featured,
    }));
}

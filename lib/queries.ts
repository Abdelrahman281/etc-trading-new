import { createClient } from '@/lib/supabase/server';
import type {
  Category,
  SubCategory,
  Product,
  RfqRequest,
  RfqSubmission,
} from '@/lib/types';

export { getCategoryIcon } from '@/lib/icons';

// Vercel's serverless functions occasionally hit a transient DNS resolution
// failure on the first fetch to an external host (e.g. Supabase) right after
// a cold start. A couple of quick retries clears this up without needing the
// visitor to reload the page.
async function withRetry<T, E>(
  fn: () => PromiseLike<{ data: T; error: E | null }>,
  attempts = 3
): Promise<{ data: T; error: E | null }> {
  let result = await fn();
  for (let attempt = 1; result.error && attempt < attempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 200 * attempt));
    result = await fn();
  }
  return result;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
  );

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase.from('categories').select('*').eq('slug', slug).maybeSingle()
  );

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data as Category | null;
}

// ─── Sub Categories ───────────────────────────────────────────────────────────

export async function getSubCategoriesByCategory(
  categoryId: string
): Promise<SubCategory[]> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: true })
  );

  if (error) {
    console.error('Error fetching sub-categories:', error);
    return [];
  }

  return data as SubCategory[];
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: true })
  );

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase.from('products').select('*').eq('id', id).maybeSingle()
  );

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data as Product | null;
}

export async function getFeaturedProducts(): Promise<
  (Product & { categoryName: string; categoryNameAr: string | null })[]
> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase
      .from('products')
      .select('*, categories(name, name_ar)')
      .eq('featured', true)
      .order('sort_order', { ascending: true })
  );

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return (
    data as unknown as Array<
      Product & { categories: { name: string; name_ar: string | null } | null }
    >
  ).map(({ categories, ...product }) => ({
    ...product,
    categoryName: categories?.name ?? '',
    categoryNameAr: categories?.name_ar ?? null,
  }));
}

export async function getAllProductSlugs(): Promise<
  { category: string; product: string }[]
> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase.from('products').select('slug, categories(slug)')
  );

  if (error) {
    console.error('Error fetching product slugs:', error);
    return [];
  }

  return (data as unknown as Array<{ slug: string; categories: { slug: string } | null }>)
    .filter((p) => p.categories)
    .map((p) => ({ category: p.categories!.slug, product: p.slug }));
}

export interface ProductDetail {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  category: string;
  categoryName: string;
  categoryNameAr: string | null;
  subcategory: string;
  subcategoryAr: string | null;
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

export async function getProductDetail(
  categorySlug: string,
  productSlug: string
): Promise<ProductDetail | null> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase
      .from('products')
      .select('*, categories(slug, name, name_ar), sub_categories(name, name_ar)')
      .eq('slug', productSlug)
      .maybeSingle()
  );

  if (error || !data) {
    if (error) console.error('Error fetching product detail:', error);
    return null;
  }

  const row = data as unknown as Product & {
    categories: { slug: string; name: string; name_ar: string | null } | null;
    sub_categories: { name: string; name_ar: string | null } | null;
  };

  if (!row.categories || row.categories.slug !== categorySlug) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    nameAr: row.name_ar,
    slug: row.slug,
    category: row.categories.slug,
    categoryName: row.categories.name,
    categoryNameAr: row.categories.name_ar,
    subcategory: row.sub_categories?.name ?? '',
    subcategoryAr: row.sub_categories?.name_ar ?? null,
    description: row.spec ?? '',
    image: row.image_url ?? '',
    images: row.images,
    features: row.features,
    specifications: row.specifications,
    applications: row.applications,
    availableSizes: row.available_sizes,
    datasheet: row.datasheet_url,
    featured: row.featured,
  };
}

export interface CategoryWithDetails extends Category {
  subCategories: (SubCategory & { products: Product[] })[];
}

export async function getCategoryWithDetails(
  slug: string
): Promise<CategoryWithDetails | null> {
  const category = await getCategoryBySlug(slug);
  if (!category) return null;

  const subCategories = await getSubCategoriesByCategory(category.id);
  const products = await getProductsByCategory(category.id);

  // Group products by sub_category_id
  const subCategoriesWithProducts = subCategories.map((sub) => ({
    ...sub,
    products: products.filter((p) => p.sub_category_id === sub.id),
  }));

  return {
    ...category,
    subCategories: subCategoriesWithProducts,
  };
}

// ─── RFQ ──────────────────────────────────────────────────────────────────────

export async function createRfqRequest(
  submission: RfqSubmission
): Promise<{ id: string } | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('rfq_requests')
    .insert({
      company: submission.company,
      contact_person: submission.contact_person,
      phone: submission.phone,
      email: submission.email,
      category: submission.category,
      message: submission.message,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Error creating RFQ request:', error);
    return null;
  }

  // Insert RFQ items if any
  if (submission.items.length > 0) {
    const items = submission.items.map((item) => ({
      rfq_request_id: data.id,
      product_name: item.product_name,
      spec: item.spec,
      category: item.category,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('rfq_items')
      .insert(items);

    if (itemsError) {
      console.error('Error creating RFQ items:', itemsError);
    }
  }

  return { id: data.id };
}

export async function getRfqRequests(): Promise<RfqRequest[]> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase
      .from('rfq_requests')
      .select('*')
      .order('created_at', { ascending: false })
  );

  if (error) {
    console.error('Error fetching RFQ requests:', error);
    return [];
  }

  return data as RfqRequest[];
}

export async function getRfqRequestById(id: string): Promise<RfqRequest | null> {
  const supabase = createClient();
  const { data, error } = await withRetry(() =>
    supabase
      .from('rfq_requests')
      .select('*, rfq_items(*)')
      .eq('id', id)
      .maybeSingle()
  );

  if (error) {
    console.error('Error fetching RFQ request:', error);
    return null;
  }

  return data as RfqRequest | null;
}

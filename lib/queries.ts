import { createClient } from '@/lib/supabase/server';
import type {
  Category,
  SubCategory,
  Product,
  RfqRequest,
  RfqSubmission,
} from '@/lib/types';

export { getCategoryIcon } from '@/lib/icons';

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

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
  const { data, error } = await supabase
    .from('sub_categories')
    .select('*')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true });

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
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data as Product | null;
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
  const { data, error } = await supabase
    .from('rfq_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching RFQ requests:', error);
    return [];
  }

  return data as RfqRequest[];
}

export async function getRfqRequestById(id: string): Promise<RfqRequest | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('rfq_requests')
    .select('*, rfq_items(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching RFQ request:', error);
    return null;
  }

  return data as RfqRequest | null;
}

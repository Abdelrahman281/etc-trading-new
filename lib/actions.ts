'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { RfqSubmission } from '@/lib/types';

export async function submitRfq(submission: RfqSubmission): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('submit_rfq', {
    p_company: submission.company,
    p_contact_person: submission.contact_person,
    p_phone: submission.phone,
    p_email: submission.email,
    p_category: submission.category,
    p_message: submission.message,
    p_items: submission.items.map((item) => ({
      product_name: item.product_name,
      spec: item.spec ?? '',
      category: item.category,
      quantity: item.quantity,
    })),
  });

  if (error || !data) {
    console.error('Error creating RFQ request:', error);
    return {
      success: false,
      error: error?.message ?? 'The request could not be completed.',
    };
  }

  revalidatePath('/admin');
  return { success: true, id: data as string };
}

export async function updateRfqStatus(
  rfqId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('rfq_requests')
    .update({ status })
    .eq('id', rfqId);

  if (error) {
    console.error('Error updating RFQ status:', error);
    return { success: false, error: 'Failed to update status.' };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rfq');
  revalidatePath(`/admin/rfq/${rfqId}`);
  return { success: true };
}

// ─── Product CRUD ─────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'product'
  );
}

async function generateUniqueProductSlug(
  supabase: ReturnType<typeof createClient>,
  name: string
): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;

  while (true) {
    const { data } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (!data) return slug;
    slug = `${base}-${suffix++}`;
  }
}

export async function createProduct(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const name = (formData.get('name') as string)?.trim();
  const spec = (formData.get('spec') as string)?.trim() || null;
  const categoryId = formData.get('category_id') as string;
  const subCategoryId = (formData.get('sub_category_id') as string) || null;
  const sortOrder = parseInt(formData.get('sort_order') as string, 10) || 0;

  if (!name || !categoryId) {
    return { success: false, error: 'Product name and category are required.' };
  }

  const slug = await generateUniqueProductSlug(supabase, name);

  const { error } = await supabase.from('products').insert({
    name,
    spec,
    slug,
    category_id: categoryId,
    sub_category_id: subCategoryId || null,
    sort_order: sortOrder,
  });

  if (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const name = (formData.get('name') as string)?.trim();
  const spec = (formData.get('spec') as string)?.trim() || null;
  const categoryId = formData.get('category_id') as string;
  const subCategoryId = (formData.get('sub_category_id') as string) || null;
  const sortOrder = parseInt(formData.get('sort_order') as string, 10) || 0;

  if (!name || !categoryId) {
    return { success: false, error: 'Product name and category are required.' };
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      spec,
      category_id: categoryId,
      sub_category_id: subCategoryId || null,
      sort_order: sortOrder,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

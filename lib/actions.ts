'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
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

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function uploadCatalogImage(
  supabase: ReturnType<typeof createClient>,
  file: File,
  folder: 'products' | 'categories'
): Promise<{ url?: string; error?: string }> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: 'Image must be a JPG, PNG, or WEBP file.' };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: 'Image must be smaller than 5MB.' };
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from('catalog-images').upload(path, file, {
    contentType: file.type,
  });

  if (error) {
    console.error('Error uploading image:', error);
    return { error: 'Failed to upload image.' };
  }

  const { data } = supabase.storage.from('catalog-images').getPublicUrl(path);
  return { url: data.publicUrl };
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
  const nameAr = (formData.get('name_ar') as string)?.trim() || null;
  const spec = (formData.get('spec') as string)?.trim() || null;
  const categoryId = formData.get('category_id') as string;
  const subCategoryId = (formData.get('sub_category_id') as string) || null;
  const sortOrder = parseInt(formData.get('sort_order') as string, 10) || 0;

  if (!name || !categoryId) {
    return { success: false, error: 'Product name and category are required.' };
  }

  let imageUrl: string | null = null;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadCatalogImage(supabase, imageFile, 'products');
    if (uploaded.error) {
      return { success: false, error: uploaded.error };
    }
    imageUrl = uploaded.url ?? null;
  }

  const slug = await generateUniqueProductSlug(supabase, name);

  const { error } = await supabase.from('products').insert({
    name,
    name_ar: nameAr,
    spec,
    slug,
    category_id: categoryId,
    sub_category_id: subCategoryId || null,
    sort_order: sortOrder,
    image_url: imageUrl,
  });

  if (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product.' };
  }

  revalidatePath('/admin/products');
  revalidateTag('catalog');
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const name = (formData.get('name') as string)?.trim();
  const nameAr = (formData.get('name_ar') as string)?.trim() || null;
  const spec = (formData.get('spec') as string)?.trim() || null;
  const categoryId = formData.get('category_id') as string;
  const subCategoryId = (formData.get('sub_category_id') as string) || null;
  const sortOrder = parseInt(formData.get('sort_order') as string, 10) || 0;

  if (!name || !categoryId) {
    return { success: false, error: 'Product name and category are required.' };
  }

  const updateData: Record<string, unknown> = {
    name,
    name_ar: nameAr,
    spec,
    category_id: categoryId,
    sub_category_id: subCategoryId || null,
    sort_order: sortOrder,
  };

  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadCatalogImage(supabase, imageFile, 'products');
    if (uploaded.error) {
      return { success: false, error: uploaded.error };
    }
    updateData.image_url = uploaded.url;
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product.' };
  }

  revalidatePath('/admin/products');
  revalidateTag('catalog');
  return { success: true };
}

// ─── Category / Sub-Category CRUD ──────────────────────────────────────────────

export async function updateCategory(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const name = (formData.get('name') as string)?.trim();
  const nameAr = (formData.get('name_ar') as string)?.trim() || null;
  const shortName = (formData.get('short_name') as string)?.trim();
  const shortNameAr = (formData.get('short_name_ar') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || '';
  const descriptionAr = (formData.get('description_ar') as string)?.trim() || null;
  const sortOrder = parseInt(formData.get('sort_order') as string, 10) || 0;

  if (!name || !shortName) {
    return { success: false, error: 'Category name and short name are required.' };
  }

  const updateData: Record<string, unknown> = {
    name,
    name_ar: nameAr,
    short_name: shortName,
    short_name_ar: shortNameAr,
    description,
    description_ar: descriptionAr,
    sort_order: sortOrder,
  };

  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadCatalogImage(supabase, imageFile, 'categories');
    if (uploaded.error) {
      return { success: false, error: uploaded.error };
    }
    updateData.image_url = uploaded.url;
  }

  const { error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category.' };
  }

  revalidatePath('/admin/categories');
  revalidateTag('catalog');
  return { success: true };
}

export async function updateSubCategory(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const name = (formData.get('name') as string)?.trim();
  const nameAr = (formData.get('name_ar') as string)?.trim() || null;

  if (!name) {
    return { success: false, error: 'Sub-category name is required.' };
  }

  const { error } = await supabase
    .from('sub_categories')
    .update({ name, name_ar: nameAr })
    .eq('id', id);

  if (error) {
    console.error('Error updating sub-category:', error);
    return { success: false, error: 'Failed to update sub-category.' };
  }

  revalidatePath('/admin/categories');
  revalidateTag('catalog');
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
  revalidateTag('catalog');
  return { success: true };
}

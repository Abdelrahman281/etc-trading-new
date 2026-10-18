'use client';

import { createClient } from '@/lib/supabase/client';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function uploadCatalogImage(
  file: File,
  folder: 'products' | 'categories'
): Promise<{ url?: string; error?: string }> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: 'Image must be a JPG, PNG, or WEBP file.' };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: 'Image must be smaller than 5MB.' };
  }

  const supabase = createClient();
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

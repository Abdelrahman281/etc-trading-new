'use client';

import { createClient } from '@/lib/supabase/client';

const MAX_DATASHEET_BYTES = 10 * 1024 * 1024;

export async function uploadCatalogDatasheet(
  file: File
): Promise<{ url?: string; error?: string }> {
  if (file.type !== 'application/pdf') {
    return { error: 'Datasheet must be a PDF file.' };
  }
  if (file.size > MAX_DATASHEET_BYTES) {
    return { error: 'Datasheet must be smaller than 10MB.' };
  }

  const supabase = createClient();
  const path = `sub-categories/${crypto.randomUUID()}.pdf`;

  const { error } = await supabase.storage.from('catalog-datasheets').upload(path, file, {
    contentType: 'application/pdf',
  });

  if (error) {
    console.error('Error uploading datasheet:', error);
    return { error: 'Failed to upload datasheet.' };
  }

  const { data } = supabase.storage.from('catalog-datasheets').getPublicUrl(path);
  return { url: data.publicUrl };
}

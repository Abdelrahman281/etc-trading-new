import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category_id');

  if (!categoryId) {
    return NextResponse.json([]);
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('sub_categories')
    .select('*')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}

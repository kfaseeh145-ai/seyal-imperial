import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  let query = supabase.from('products').select('*', { count: 'exact' });

  if (keyword) {
    query = query.ilike('name', `%${keyword}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase Error fetching products:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: data,
    page: 1,
    pages: 1,
    count
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description, images, category, stock, notes } = body;

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        price,
        description,
        images,
        category,
        stock,
        notes
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


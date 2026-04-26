import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;


  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { name, price, description, images, category, stock, notes } = body;

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        price,
        description,
        images,
        category,
        stock,
        notes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log('Attempting to delete product:', id);

  try {
    // 1. Manually detach this product from any existing orders first
    const { error: detachError } = await supabase
      .from('order_items')
      .update({ product_id: null })
      .eq('product_id', id);
    
    if (detachError) console.error('Detach error:', detachError);

    // 2. Now delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Final delete error:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'Product removed' });
  } catch (error: any) {
    console.error('Full catch error:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

}

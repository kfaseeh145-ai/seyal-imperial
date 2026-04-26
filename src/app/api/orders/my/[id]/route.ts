import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // 1. Get the user's email from profiles (using maybeSingle to avoid errors if not found)
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', id)
      .maybeSingle();

    // 2. Fetch orders matching user_id OR matching email in shipping_address
    let orders: any[] = [];
    
    if (profile?.email) {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .or(`user_id.eq.${id},shipping_address->>email.ilike.${profile.email}`)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw new Error(fetchError.message);
      orders = data || [];
    } else {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw new Error(fetchError.message);
      orders = data || [];
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('My Orders Fetch Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderItems, shippingAddress, paymentMethod, isGiftPack, totalPrice, user_id } = body;

    // 1. Insert the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user_id, // We'll pass this from the frontend for now, or get from session
        total_price: totalPrice,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        is_gift_pack: isGiftPack,
        is_paid: false,
        is_delivered: false,
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Insert order items
    const itemsToInsert = orderItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product,
      name: item.name,
      qty: item.qty,
      price: item.price,
      image: item.image,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw new Error(itemsError.message);

    // 3. Send Confirmation Email via Resend
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Attempt to get user email from profiles if available
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', user_id)
        .single();

      const customerEmail = profile?.email || shippingAddress.email;
      const customerName = profile?.name || shippingAddress.name || 'Valued Client';

      if (!customerEmail) {
        console.warn('No email found for order confirmation');
        return NextResponse.json(order, { status: 201 });
      }

      await resend.emails.send({
        from: 'Seyal Imperial <noreply@seyalimperial.com>',
        to: customerEmail,
        subject: `Your Seyal Imperial Order - #${order.id.substring(0, 8).toUpperCase()}`,

        html: `
          <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; padding: 40px; background-color: #fafafa;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #eee;">
              <h1 style="color: #c9a96e; text-align: center; font-size: 28px; letter-spacing: 2px;">SEYAL IMPÉRIAL</h1>
              <div style="height: 1px; background: #c9a96e; margin: 20px 0; opacity: 0.3;"></div>
              
              <p style="font-size: 16px; line-height: 1.6;">Dear ${customerName},</p>
              <p style="font-size: 16px; line-height: 1.6;">Thank you for your acquisition. We are pleased to confirm that your order has been successfully placed and is now being prepared by our artisans.</p>
              
              <div style="background: #fdfbf7; padding: 20px; margin: 30px 0;">
                <h3 style="margin-top: 0; color: #c9a96e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
                <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.id.substring(0, 8).toUpperCase()}</p>
                <p style="margin: 5px 0;"><strong>Total Investment:</strong> PKR ${totalPrice}</p>
                <p style="margin: 5px 0;"><strong>Delivery Method:</strong> Cash on Delivery</p>
              </div>

              <h3 style="color: #c9a96e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Shipping Address</h3>
              <p style="font-size: 14px; color: #666; line-height: 1.6;">
                ${shippingAddress.address}<br/>
                ${shippingAddress.city}, ${shippingAddress.country}<br/>
                Contact: ${shippingAddress.phone}
              </p>

              <div style="height: 1px; background: #eee; margin: 30px 0;"></div>
              
              <p style="font-size: 14px; color: #888; text-align: center; font-style: italic;">"A fragrance is more than a scent; it is a legacy."</p>
              
              <p style="text-align: center; margin-top: 40px; font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">
                Seyal Impérial &copy; 2026
              </p>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Order email failed:', emailErr);
    }

    return NextResponse.json(order, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Fetch profiles separately or handle nulls to avoid 500 errors if join fails
    const mappedOrders = await Promise.all(orders.map(async (o) => {
      let userData = { name: 'Guest', email: '' };
      
      if (o.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', o.user_id)
          .single();
        
        if (profile) userData = profile;
      }

      return {
        ...o,
        _id: o.id,
        createdAt: o.created_at,
        user: userData
      };
    }));

    return NextResponse.json(mappedOrders);
  } catch (error: any) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}



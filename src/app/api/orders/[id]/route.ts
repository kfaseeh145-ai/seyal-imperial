import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;


  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }

  // Map to the format the frontend expects (order_items -> orderItems)
  const mappedOrder = {
    ...order,
    orderItems: order.order_items
  };

  return NextResponse.json(mappedOrder);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await request.json().catch(() => ({}));
  
  const updateData: any = {};
  
  // Handle Payment Update (Success Page)
  if (body.isPaid) {
    updateData.is_paid = true;
    updateData.paid_at = new Date().toISOString();
  }

  // Handle Delivery Update (Admin Dashboard)
  if (body.isDelivered) {
    updateData.is_delivered = true;
    updateData.delivered_at = new Date().toISOString();
    updateData.is_paid = true; // Auto-pay on delivery (COD)
    updateData.order_status = 'Completed'; // Set status to Completed
  }


  const { data: order, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  // ONLY Send Delivery Notification if it was just marked as delivered
  if (body.isDelivered) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      let targetEmail = null;
      let targetName = 'Valued Client';

      if (order.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, name')
          .eq('id', order.user_id)
          .single();
        if (profile) {
          targetEmail = profile.email;
          targetName = profile.name || targetName;
        }
      }

      // Fallback to shipping address if profile email is missing
      if (!targetEmail && order.shipping_address?.email) {
        targetEmail = order.shipping_address.email;
        targetName = order.shipping_address.name || targetName;
      }

      // Last resort: Check Supabase Auth directly if we still have no email
      if (!targetEmail && order.user_id) {
        const { data: { user: authUser } } = await supabase.auth.admin.getUserById(order.user_id);
        if (authUser?.email) {
          targetEmail = authUser.email;
          targetName = authUser.user_metadata?.name || targetName;
        }
      }

      if (targetEmail) {
        console.log(`Attempting to send completion email to: ${targetEmail}`);
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'Seyal Imperial <noreply@seyalimperial.com>',
          to: targetEmail,
          subject: `Delivered: Your Seyal Imperial Order - #${order.id.substring(0, 8).toUpperCase()}`,
          html: `
            <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; padding: 40px; background-color: #ffffff; border: 1px solid #c9a96e;">
              <div style="max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #c9a96e; font-size: 24px; letter-spacing: 4px; margin: 0;">SEYAL IMPÉRIAL</h1>
                  <p style="text-transform: uppercase; font-size: 10px; tracking: 2px; color: #888;">London • Dubai • Lahore</p>
                </div>
                
                <div style="height: 1px; background: #c9a96e; margin: 20px 0; opacity: 0.2;"></div>
                
                <h2 style="color: #1a1a1a; text-align: center; font-size: 20px; font-weight: normal; margin-bottom: 30px;">Your Acquisition has Arrived</h2>
                
                <p style="font-size: 15px; line-height: 1.8; color: #444;">Dear ${targetName},</p>
                <p style="font-size: 15px; line-height: 1.8; color: #444;">We are pleased to confirm that your order <strong>#${order.id.substring(0, 8).toUpperCase()}</strong> has been successfully delivered.</p>
                
                <p style="font-size: 15px; line-height: 1.8; color: #444;">It has been an honor to serve you. We hope this fragrance becomes a signature part of your legacy.</p>
                
                <div style="background: #fcf9f2; padding: 30px; text-align: center; margin: 40px 0; border: 1px solid #f0e6d2;">
                  <p style="margin: 0; color: #c9a96e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">We Value Your Presence</p>
                  <p style="font-size: 13px; color: #777; margin-top: 10px;">Share your experience with our artisans.</p>
                  <a href="https://seyalimperial.com/feedback" style="display: inline-block; margin-top: 20px; padding: 14px 35px; background: #c9a96e; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; font-weight: bold;">Leave Feedback</a>
                </div>

                <div style="text-align: center; color: #aaa; font-size: 11px; margin-top: 50px; text-transform: uppercase; letter-spacing: 2px;">
                  <p>Seyal Impérial • The Art of Presence</p>
                </div>
              </div>
            </div>
          `
        });

        if (emailError) {
          console.error('Resend API Error:', emailError);
        } else {
          console.log('Completion email sent successfully:', emailData?.id);
        }
      } else {
        console.warn('No target email found for order completion notification');
      }
    } catch (emailErr) {
      console.error('Completion email process crashed:', emailErr);
    }
  }


  return NextResponse.json({ ...order, _id: order.id, orderStatus: updateData.is_delivered ? 'Completed' : 'Processing' });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;


  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Order removed' });
}


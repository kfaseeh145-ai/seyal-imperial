"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';

type PaymentMethod = 'COD' | 'CARD';

const paymentClient = loadStripe(process.env.NEXT_PUBLIC_PAYMENTS_PUBLIC_KEY || '');

function CardCheckoutSection({ disabled }: { disabled: boolean }) {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <div className={`border border-white/10 bg-black/30 rounded-sm p-5 ${disabled ? 'opacity-60' : ''}`}>
      <div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">Card Details</div>
      <div className="border border-white/10 bg-black rounded-sm px-4 py-4">
        <CardElement
          options={{
            style: {
              base: {
                color: '#ededed',
                fontFamily: 'Outfit, system-ui, sans-serif',
                fontSize: '16px',
                '::placeholder': { color: '#6b7280' },
              },
              invalid: { color: '#f87171' },
            },
          }}
        />
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-widest text-gray-500">
        Your card details are entered securely.
      </div>
      <div className="sr-only">{String(!!stripe && !!elements)}</div>
    </div>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    []
  );

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        name: item.name,
        qty: item.quantity,
        image: item.imageUrl,
        price: item.price,
        product: item.id, // must be Product _id (Mongo ObjectId)
      })),
    [items]
  );

  const canSubmit =
    !loading &&
    items.length > 0 &&
    address.trim() &&
    city.trim() &&
    postalCode.trim() &&
    country.trim() &&
    (paymentMethod === 'COD' || (!!stripe && !!elements));

  const submit = async () => {
    if (!isAuthenticated || !user?.token) {
      router.push('/login');
      return;
    }
    if (!canSubmit) return;

    setLoading(true);
    setError('');

    try {
      // 1) Create the order (payment pending)
      const createRes = await fetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: { address, city, postalCode, country },
          paymentMethod: paymentMethod === 'COD' ? 'CashOnDelivery' : 'Card',
          totalPrice: Number(getCartTotal().toFixed(2)),
        }),
      });

      const created: any = await createRes.json();
      if (!createRes.ok) throw new Error(created?.message || 'Failed to create order');

      const orderId = created?._id;
      if (!orderId) throw new Error('Order was created without an id');

      // 2) COD: go straight to receipt
      if (paymentMethod === 'COD') {
        clearCart();
        router.push(`/order/${orderId}`);
        return;
      }

      if (!stripe || !elements) throw new Error('Payment form is not ready');

      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Card input is missing');

      // 3) Create payment intent for the order
      const intentRes = await fetch(`${apiBase}/orders/${orderId}/payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      const intent: any = await intentRes.json();
      if (!intentRes.ok) throw new Error(intent?.message || 'Failed to start payment');
      if (!intent?.clientSecret) throw new Error('Missing payment client secret');

      // 4) Confirm payment using the embedded card form
      const result = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.name || undefined,
            email: user?.email || undefined,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      }

      if (result.paymentIntent?.status !== 'succeeded' && result.paymentIntent?.status !== 'processing') {
        throw new Error('Payment not completed');
      }

      clearCart();
      router.push(`/success?orderId=${orderId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="w-full max-w-xl bg-[#0a0a0a] p-8 border border-white/5 rounded-sm text-center">
          <h1 className="text-3xl font-serif text-white mb-2">Checkout</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Your cart is empty</p>
          <div className="mt-8">
            <Button onClick={() => router.push('/')}>Return to Collection</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-20 px-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <header className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
            Secure <span className="text-[var(--color-gold)] italic">Checkout</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.35em] mt-2">
            Shipping → Payment → Receipt
          </p>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 mb-6 text-sm text-center rounded-sm">
            {error}
          </div>
        )}

        <div className="bg-[#0a0a0a] border border-white/5 rounded-sm p-6 md:p-8 space-y-10 shadow-2xl">
          <div>
            <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="Street, building, apartment"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="Postal code"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Country</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`text-left p-5 border rounded-sm transition-colors ${
                  paymentMethod === 'CARD'
                    ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5'
                    : 'border-white/10 bg-black hover:border-white/20'
                }`}
              >
                <div className="text-white tracking-wide">Card</div>
                <div className="text-gray-500 text-xs tracking-widest uppercase mt-1">Secure payment</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`text-left p-5 border rounded-sm transition-colors ${
                  paymentMethod === 'COD'
                    ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5'
                    : 'border-white/10 bg-black hover:border-white/20'
                }`}
              >
                <div className="text-white tracking-wide">Cash on Delivery</div>
                <div className="text-gray-500 text-xs tracking-widest uppercase mt-1">Pay at arrival</div>
              </button>
            </div>

            {paymentMethod === 'CARD' && (
              <div className="mt-6">
                <CardCheckoutSection disabled={loading} />
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-gray-500">Total</div>
              <div className="text-2xl font-serif text-white tracking-widest">
                ${getCartTotal().toFixed(2)}
              </div>
            </div>

            <Button size="lg" disabled={!canSubmit} onClick={submit} className="w-full md:w-auto min-w-[220px]">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Processing…
                </>
              ) : paymentMethod === 'COD' ? (
                'Place Order'
              ) : (
                'Pay Securely'
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={paymentClient}>
      <CheckoutInner />
    </Elements>
  );
}


"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuth();
  
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login?redirect=checkout');
    }
  }, [isInitialized, isAuthenticated, router]);


  const { 
    items, 
    getCartTotal, 
    getCartSubtotal, 
    getDeliveryCharges, 
    getDiscount, 
    clearCart 
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [isGiftPack, setIsGiftPack] = useState(false);

  const GIFT_PACK_PRICE = 199;

  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api',
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
    phone.trim() &&
    city.trim() &&
    country.trim();

  const submit = async () => {
    if (!isAuthenticated || !user?.token) {
      router.push('/login');
      return;
    }
    if (!canSubmit) return;

    setLoading(true);
    setError('');

    try {
      const createRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: { 
            name: user.name, // Save the name directly with the order
            email: user.email, // Save the email directly with the order
            address, 
            city, 
            postalCode, 
            country, 
            phone 
          },

          paymentMethod: 'CashOnDelivery',
          isGiftPack,
          totalPrice: Number((getCartTotal() + (isGiftPack ? GIFT_PACK_PRICE : 0)).toFixed(2)),
          user_id: user.id,
        }),

      });

 
      const created: any = await createRes.json();
      if (!createRes.ok) throw new Error(created?.message || 'Failed to create order');
 
      const orderId = created?.id; // Supabase uses 'id'
      if (!orderId) throw new Error('Order was created without an id');
 
      clearCart();
      router.push(`/order/${orderId}`);
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
            Shipping → Receipt
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
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="+92 300 1234567"
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
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Postal Code <span className="text-[10px] lowercase text-gray-600 tracking-normal">(Optional)</span>
                </label>
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
              Order Extras
            </h2>
            <div 
              onClick={() => setIsGiftPack(!isGiftPack)}
              className={`flex items-center justify-between p-5 border rounded-sm cursor-pointer transition-all ${
                isGiftPack 
                ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5' 
                : 'border-white/10 bg-black/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                  isGiftPack ? 'border-[var(--color-gold)] bg-[var(--color-gold)]' : 'border-white/20'
                }`}>
                  {isGiftPack && <div className="w-2 h-2 bg-black rounded-full" />}
                </div>
                <div>
                  <div className="text-white tracking-wide">Add Gift Pack / Wrap</div>
                  <div className="text-gray-500 text-xs tracking-widest uppercase mt-1">Perfect for presents</div>
                </div>
              </div>
              <div className="text-[var(--color-gold)] font-medium">+ PKR {GIFT_PACK_PRICE}</div>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
              Payment Method
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="text-left p-5 border rounded-sm transition-colors border-[var(--color-gold)] bg-[var(--color-gold)]/5">
                <div className="text-white tracking-wide">Cash on Delivery</div>
                <div className="text-gray-500 text-xs tracking-widest uppercase mt-1">Pay at arrival</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-500">
              <span>Subtotal</span>
              <span>PKR {getCartSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-500">
              <span>Delivery</span>
              <span className={getDeliveryCharges() === 0 ? "text-green-500" : ""}>
                {getDeliveryCharges() === 0 ? 'FREE' : `PKR ${getDeliveryCharges().toFixed(2)}`}
              </span>
            </div>
            {getDiscount() > 0 && (
              <div className="flex justify-between text-xs uppercase tracking-widest text-green-500">
                <span>Discount (10% OFF)</span>
                <span>-PKR {getDiscount().toFixed(2)}</span>
              </div>
            )}
            {isGiftPack && (
              <div className="flex justify-between text-xs uppercase tracking-widest text-[var(--color-gold)]">
                <span>Gift Pack Fee</span>
                <span>PKR {GIFT_PACK_PRICE.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-gray-500">Total</div>
                <div className="text-2xl font-serif text-white tracking-widest">
                  PKR {(getCartTotal() + (isGiftPack ? GIFT_PACK_PRICE : 0)).toFixed(2)}
                </div>
              </div>

              <Button size="lg" disabled={!canSubmit} onClick={submit} className="w-full md:w-auto min-w-[220px]">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

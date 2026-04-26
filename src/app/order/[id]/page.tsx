"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/useAuth';

export default function OrderReceiptPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user, isAuthenticated, isInitialized } = useAuth();


  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<unknown>(null);

  const orderId = params?.id;

  useEffect(() => {
    if (!isInitialized) return; // Wait for auth to initialize
    
    // Removed mandatory login to allow guest receipt viewing
    // if (!isAuthenticated || !user?.token) {
    //   router.push('/login');
    //   return;
    // }

    if (!orderId) return;

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data: any = await res.json();
        if (!res.ok) {
          const message =
            typeof data === 'object' && data !== null && 'message' in data
              ? String((data as any).message)
              : 'Failed to load order';
          throw new Error(message);
        }
        setOrder(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [apiBase, isAuthenticated, orderId, router, user?.token]);

  return (
    <section className="min-h-screen pt-28 pb-20 px-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <header className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
            Order <span className="text-[var(--color-gold)] italic">Receipt</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.35em] mt-2">
            Reference: {orderId ? String(orderId).substring(0, 8).toUpperCase() : '—'}
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[var(--color-gold)]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="uppercase tracking-widest text-xs">Loading receipt…</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-sm text-sm text-center">
            {error}
          </div>
        ) : (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-sm p-6 md:p-8 shadow-2xl space-y-8">
            {(() => {
              const o: any = order as any;
              return (
                <>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-gray-500">Payment</div>
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-sm ${
                      o?.is_paid
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {o?.is_paid ? 'Secure' : 'Pending'}
                  </span>
                </div>
              </div>

              {o?.is_paid && (
                <div className="flex items-center gap-2 text-green-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-widest">Payment captured</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">Items</div>
              <div className="space-y-4">
                {o?.orderItems?.map((it: any) => (
                  <div key={it.id || it.product_id || it.name} className="flex items-center justify-between gap-4 border border-white/10 bg-black/30 rounded-sm p-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={it.image} alt={it.name} className="w-14 h-16 object-contain bg-black border border-white/5 rounded p-2" />
                      <div className="min-w-0">
                        <div className="text-white font-serif truncate">{it.name}</div>
                        <div className="text-gray-500 text-xs tracking-widest uppercase mt-1">Qty: {it.qty}</div>
                      </div>
                    </div>
                    <div className="text-[var(--color-gold-light)] font-mono text-sm">
                      PKR {(Number(it.price) * Number(it.qty)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">Shipping</div>
                <div className="text-sm text-gray-300 leading-relaxed">
                  <div>{o?.shipping_address?.address}</div>
                  <div>{o?.shipping_address?.phone}</div>
                  <div>
                    {o?.shipping_address?.city} {o?.shipping_address?.postalCode}
                  </div>
                  <div>{o?.shipping_address?.country}</div>
                </div>
              </div>
              <div className="md:text-right">
                <div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">Total</div>
                <div className="text-3xl font-serif text-white tracking-widest">
                  PKR {Number(o?.total_price || 0).toFixed(2)}
                </div>
                <div className="text-gray-500 text-xs tracking-widest uppercase mt-2">
                  Method: {o?.payment_method || '—'}
                </div>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">Continue Shopping</Button>
              </Link>
              <Link href="/orders" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">View My Orders</Button>
              </Link>
            </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
}


"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/useAuth';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuth();


  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    []
  );

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || !user?.id)) {
      router.push('/login');
      return;
    }

    if (!isInitialized) return;


    const run = async () => {
      setLoading(true);
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/orders/my/${user.id}`);

        const data: any = await res.json();
        if (!res.ok) {
          const message =
            typeof data === 'object' && data !== null && 'message' in data
              ? String((data as any).message)
              : 'Failed to load orders';
          throw new Error(message);
        }
        setOrders(Array.isArray(data) ? (data as any[]) : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [apiBase, isAuthenticated, router, user?.token]);

  return (
    <section className="min-h-screen pt-28 pb-20 px-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <header className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
            My <span className="text-[var(--color-gold)] italic">Orders</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.35em] mt-2">
            Receipts & payment status
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[var(--color-gold)]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="uppercase tracking-widest text-xs">Syncing receipts…</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-sm text-sm text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-sm p-10 text-center">
            <p className="text-gray-400 tracking-widest uppercase text-xs mb-6">No orders yet</p>
            <Button onClick={() => router.push('/')}>Browse Collection</Button>
          </div>
        ) : (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[820px]">
                <thead>
                  <tr className="border-b border-white/10 uppercase tracking-widest text-[10px] text-gray-500">
                    <th className="p-4 font-normal">Order</th>
                    <th className="p-4 font-normal">Date</th>
                    <th className="p-4 font-normal">Total</th>
                    <th className="p-4 font-normal">Paid</th>
                    <th className="p-4 font-normal">Status</th>
                    <th className="p-4 font-normal">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                      <td className="p-4 text-gray-300 font-mono text-xs">{String(o.id).substring(0, 8).toUpperCase()}</td>
                      <td className="p-4 text-gray-500 tracking-widest text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-[var(--color-gold-light)]">PKR {Number(o.total_price || 0).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-sm ${o.is_paid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                          {o.is_paid ? 'Secure' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 tracking-[0.2em] uppercase text-[10px] text-gray-400">
                        <span className="py-1 px-3 border border-white/10 rounded-full">{o.order_status || 'Pending'}</span>
                      </td>
                      <td className="p-4">
                        <Link href={`/order/${o.id}`} className="inline-block">
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


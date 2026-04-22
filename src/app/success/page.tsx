"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';

type ReceiptState = 'confirming' | 'confirmed' | 'needs_login' | 'error';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const clearCart = useCart((s) => s.clearCart);

  const orderId = useMemo(() => searchParams.get('orderId') || '', [searchParams]);
  const sessionId = useMemo(() => searchParams.get('session_id') || '', [searchParams]);
  const simulated = useMemo(() => searchParams.get('simulated') === 'true', [searchParams]);

  const [state, setState] = useState<ReceiptState>('confirming');
  const [message, setMessage] = useState<string>('');
  const pollTimer = useRef<number | null>(null);

  const confirmPayment = async () => {
    if (!orderId) {
      setState('error');
      setMessage('Missing order reference. Please return to the store and try again.');
      return;
    }

    if (!isAuthenticated || !user?.token) {
      setState('needs_login');
      setMessage('Please sign in to confirm your receipt and secure your order.');
      return;
    }

    setState('confirming');
    setMessage(simulated ? 'Simulating secure confirmation…' : 'Waiting for payment confirmation…');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Simulator/dev fallback: flip the order immediately if we're in simulated mode
      if (simulated) {
        const res = await fetch(`${apiBase}/orders/${orderId}/pay`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            session_id: sessionId || undefined,
            paymentResult: {
              id: sessionId || undefined,
              status: 'simulated',
            },
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Unable to confirm payment.');
        clearCart();
        setState('confirmed');
        setMessage('Payment confirmed. Your order is now secured in the vault.');
        return;
      }

      // Real card flow: webhook marks isPaid. We poll the order until it flips.
      const poll = async () => {
        const res = await fetch(`${apiBase}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Unable to fetch order status.');

        if (data?.isPaid) {
          clearCart();
          setState('confirmed');
          setMessage('Payment confirmed. Your order is now secured in the vault.');
          return true;
        }
        return false;
      };

      // quick first check, then poll
      const done = await poll();
      if (done) return;

      let attempts = 0;
      pollTimer.current = window.setInterval(async () => {
        attempts += 1;
        try {
          const isDone = await poll();
          if (isDone || attempts >= 30) {
            if (pollTimer.current) window.clearInterval(pollTimer.current);
            pollTimer.current = null;
            if (!isDone) {
              setState('error');
              setMessage('Payment is still processing. Please check your receipt in “My Orders” in a moment.');
            }
          }
        } catch (e: unknown) {
          if (pollTimer.current) window.clearInterval(pollTimer.current);
          pollTimer.current = null;
          setState('error');
          setMessage(e instanceof Error ? e.message : 'Unable to confirm payment.');
        }
      }, 2000);
    } catch (err: unknown) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Unable to confirm payment.');
    }
  };

  useEffect(() => {
    confirmPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, sessionId, simulated, isAuthenticated, user?.token]);

  useEffect(() => {
    return () => {
      if (pollTimer.current) window.clearInterval(pollTimer.current);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="w-full max-w-2xl bg-[#0a0a0a] p-8 border border-white/5 rounded-sm shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,169,110,0.12)_0%,transparent_55%)] pointer-events-none" />

        <div className="relative">
          <div className="text-center mb-8">
            <p className="text-gray-400 text-xs tracking-[0.35em] uppercase">Receipt</p>
            <h1 className="text-3xl md:text-4xl font-serif text-white mt-2">
              Checkout <span className="text-[var(--color-gold)] italic">Success</span>
            </h1>
          </div>

          <div className="border border-white/10 bg-black/40 rounded-sm p-6">
            {state === 'confirming' && (
              <div className="flex flex-col items-center text-center gap-4 py-6 text-[var(--color-gold)]">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="uppercase tracking-widest text-xs">{message || 'Confirming…'}</p>
              </div>
            )}

            {state === 'confirmed' && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <ShieldCheck className="w-12 h-12 text-green-400" />
                <p className="text-white tracking-wide">{message}</p>
                <p className="text-gray-500 text-xs tracking-widest uppercase">
                  Order reference: <span className="text-gray-300 font-mono">{orderId ? orderId.slice(-8) : '—'}</span>
                </p>
                <Link href={`/order/${orderId}`} className="mt-2 w-full sm:w-auto">
                  <Button size="md" className="w-full sm:w-auto">View Receipt</Button>
                </Link>
              </div>
            )}

            {state === 'needs_login' && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <XCircle className="w-12 h-12 text-[var(--color-gold)]" />
                <p className="text-white tracking-wide">{message}</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
                  <Button
                    size="md"
                    onClick={() => router.push(`/login`)}
                    className="w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    onClick={confirmPayment}
                    className="w-full sm:w-auto"
                  >
                    Retry Confirmation
                  </Button>
                </div>
              </div>
            )}

            {state === 'error' && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <XCircle className="w-12 h-12 text-red-400" />
                <p className="text-white tracking-wide">{message || 'Something went wrong.'}</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
                  <Button size="md" onClick={confirmPayment} className="w-full sm:w-auto">
                    Retry
                  </Button>
                  <Link href="/orders" className="w-full sm:w-auto">
                    <Button size="md" variant="outline" className="w-full sm:w-auto">
                      My Orders
                    </Button>
                  </Link>
                  <Link href="/" className="w-full sm:w-auto">
                    <Button size="md" variant="outline" className="w-full sm:w-auto">
                      Return Home
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-gray-500 tracking-widest uppercase">
            If you are an administrator, confirm the order is now marked <span className="text-green-400">Secure</span> in the portal.
          </div>
        </div>
      </div>
    </section>
  );
}


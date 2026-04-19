"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, user, router]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-full text-[var(--color-gold)]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="text-white w-full max-w-7xl">
            <header className="mb-12 border-b border-white/5 pb-6">
                <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
                    Executive <span className="text-[var(--color-gold)] italic">Dashboard</span>
                </h1>
            </header>
            
            <div className="bg-[#0a0a0a] border border-white/5 rounded-sm p-1 md:p-6 overflow-x-auto shadow-2xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--color-gold)]">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="uppercase tracking-widest text-xs">Syncing Ledgers...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 tracking-widest uppercase mb-2">No orders have been placed yet.</p>
                        <p className="text-gray-700 text-xs">When customers check out securely via Stripe, receipts will populate here.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10 uppercase tracking-widest text-[10px] text-gray-500">
                                <th className="p-4 font-normal">Order ID</th>
                                <th className="p-4 font-normal">Client / Email</th>
                                <th className="p-4 font-normal">Date Executed</th>
                                <th className="p-4 font-normal">Net Revenue</th>
                                <th className="p-4 font-normal">Cleared</th>
                                <th className="p-4 font-normal">Logistics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o: any) => (
                                <tr key={o._id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm group">
                                    <td className="p-4 text-gray-400 font-mono text-xs">{o._id.substring(o._id.length - 8)}</td>
                                    <td className="p-4 tracking-wide">{o.user?.name || 'Guest'}</td>
                                    <td className="p-4 text-gray-500 tracking-widest text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-[var(--color-gold-light)] drop-shadow-md pb-0">${o.totalPrice}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-sm ${o.isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                            {o.isPaid ? 'Secure' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 tracking-[0.2em] uppercase text-[10px] text-gray-400">
                                        <span className="py-1 px-3 border border-white/10 rounded-full">{o.orderStatus || 'Processing'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

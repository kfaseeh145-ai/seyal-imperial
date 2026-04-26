"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Trash2, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
    const { user, isAuthenticated, isInitialized } = useAuth();

    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const markAsCompleted = async (id: string) => {
        if (!window.confirm('Mark this order as completed and paid?')) return;
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ isDelivered: true })
            });

            const data = await res.json();
            if (res.ok) {
                setOrders(orders.map(o => (o.id === id) ? { ...o, order_status: 'Completed', is_delivered: true, is_paid: true } : o));
            } else {
                alert(`Error: ${data.message || 'Failed to update order'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to connect to server');
        }
    };

    const deleteOrder = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setOrders(orders.filter(o => o.id !== id));
            } else {
                alert(`Error: ${data.message || 'Failed to delete order'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to connect to server');
        }
    };

    useEffect(() => {
        if (isInitialized && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/login');
            return;
        }


        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isInitialized, isAuthenticated, user, router]);

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
                        <p className="text-gray-700 text-xs">When customers place orders, they will appear here.</p>
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
                                <th className="p-4 font-normal">Details</th>
                                <th className="p-4 font-normal text-center">Completed</th>
                                <th className="p-4 font-normal text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o: any) => (
                                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm group">
                                    <td className="p-4 text-gray-400 font-mono text-xs">{o.id.substring(0, 8).toUpperCase()}</td>
                                    <td className="p-4 tracking-wide">
                                        <div className="text-white">{o.user?.name && o.user.name !== 'Guest' ? o.user.name : (o.shipping_address?.name || 'Guest')}</div>
                                        <div className="text-[10px] text-gray-500 mt-1">{o.shipping_address?.phone || o.user?.email}</div>
                                    </td>
                                    <td className="p-4 text-gray-500 tracking-widest text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-[var(--color-gold-light)] drop-shadow-md pb-0">PKR {Number(o.total_price || 0).toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-sm ${o.is_paid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                            {o.is_paid ? 'Secure' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 tracking-[0.2em] uppercase text-[10px] text-gray-400">
                                        <span className="py-1 px-3 border border-white/10 rounded-full">{o.order_status || 'Processing'}</span>
                                    </td>

                                    <td className="p-4">
                                        <Link
                                            href={`/order/${o.id}`}
                                            className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] hover:text-white border border-[var(--color-gold)]/30 hover:border-white/30 px-3 py-1 rounded-sm transition-colors"
                                        >
                                            View
                                        </Link>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => markAsCompleted(o.id)}
                                            disabled={o.order_status === 'Completed'}
                                            className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm transition-colors border ${o.order_status === 'Completed' ? 'border-green-500/20 text-green-500/40 cursor-not-allowed' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}`}
                                        >
                                            {o.order_status === 'Completed' ? 'Done' : 'Complete'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => deleteOrder(o.id)}
                                            className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
            </div>
        </div>
    );
}

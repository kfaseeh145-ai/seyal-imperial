"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AdminProducts() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/login');
            return;
        }

        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`);
                const data = await res.json();
                setProducts(data.products || []);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isAuthenticated, user, router]);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this masterpiece?')) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                });

                if (res.ok) {
                    setProducts(products.filter((p: any) => p._id !== id));
                } else {
                    alert('Failed to delete product.');
                }
            } catch (error) {
                console.error(error);
                alert('Error deleting product');
            }
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-full text-[var(--color-gold)]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="text-white w-full max-w-7xl">
            <header className="mb-12 border-b border-white/5 pb-6 flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
                    Product <span className="text-[var(--color-gold)] italic">Manager</span>
                </h1>
                
                <Link href="/admin/products/new">
                    <Button variant="outline" className="flex items-center gap-2 border-[var(--color-gold)]/50 text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black">
                        <Plus size={16} /> New Product
                    </Button>
                </Link>
            </header>
            
            <div className="bg-[#0a0a0a] border border-white/5 rounded-sm p-1 md:p-6 overflow-x-auto shadow-2xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--color-gold)]">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="uppercase tracking-widest text-xs">Loading Catalog...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 tracking-widest uppercase mb-2">No products exist in your catalog.</p>
                        <p className="text-gray-700 text-xs">Click "New Product" to build your empire.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10 uppercase tracking-widest text-[10px] text-gray-500">
                                <th className="p-4 font-normal">ID</th>
                                <th className="p-4 font-normal">Name</th>
                                <th className="p-4 font-normal">Price</th>
                                <th className="p-4 font-normal">Category</th>
                                <th className="p-4 font-normal">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p: any) => (
                                <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm group">
                                    <td className="p-4 text-gray-400 font-mono text-xs">{p._id || p.id}</td>
                                    <td className="p-4 tracking-wide font-serif text-[var(--color-gold-light)]">{p.name}</td>
                                    <td className="p-4 text-white tracking-widest text-xs font-bold">${p.price}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-sm bg-white/5 border border-white/10 text-gray-300">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-3">
                                        <button onClick={() => deleteHandler(p._id || p.id)} className="text-red-500/80 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-500/10">
                                            <Trash2 size={16} />
                                        </button>
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

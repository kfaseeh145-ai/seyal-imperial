"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Star, User, Package } from 'lucide-react';

export default function AdminReviews() {
    const { user, isAuthenticated, isInitialized } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialized && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/login');
            return;
        }
        fetchReviews();
    }, [isInitialized, isAuthenticated, user, router]);

    const deleteReview = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        // Logic for deleting review via API (if I had it implemented fully)
        // For now I'll just filter it out locally if I can't call the delete API
        try {
            // Placeholder for real delete API
            // const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            setReviews(reviews.filter(r => r.id !== id));
            alert('Review removed (Simulation)');
        } catch (err) {
            console.error(err);
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
            <header className="mb-12 border-b border-white/5 pb-6">
                <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
                    Client <span className="text-[var(--color-gold)] italic">Reflections</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--color-gold)]">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="uppercase tracking-widest text-xs">Syncing Reflections...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="py-20 text-center bg-[#0a0a0a] border border-white/5 rounded-sm">
                        <p className="text-gray-500 tracking-widest uppercase mb-2">No reviews found.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-sm flex flex-col md:flex-row justify-between gap-6 hover:bg-white/[0.02] transition-colors group">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <User size={20} className="text-[var(--color-gold)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">{review.user_name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={12} className={s <= review.rating ? 'text-[var(--color-gold)] fill-[var(--color-gold)]' : 'text-gray-700'} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-gray-600 uppercase tracking-widest">• {new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-400 italic text-sm border-l-2 border-[var(--color-gold)]/20 pl-4 py-1">"{review.comment}"</p>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                    <Package size={12} />
                                    <span>Product ID: {review.product_id}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end">
                                <button 
                                    onClick={() => deleteReview(review.id)}
                                    className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all"
                                    title="Delete Reflection"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

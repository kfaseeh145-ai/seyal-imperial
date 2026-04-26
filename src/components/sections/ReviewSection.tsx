"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Loader2, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/useAuth';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ReviewSection({ productId: initialProductId }: { productId?: string }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');

  const fetchReviews = async () => {
    try {
      const url = initialProductId ? `/api/reviews?productId=${initialProductId}` : '/api/reviews';
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (initialProductId) return;
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, [initialProductId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!selectedProductId) {
        setError('Please select a product to review');
        return;
    }
    if (!isAuthenticated && !guestName.trim()) {
        setError('Please provide your name');
        return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          userId: user?.id,
          userName: isAuthenticated ? user?.name : guestName,
          rating,
          comment
        }),
      });

      if (!res.ok) throw new Error('Failed to post review');

      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setComment('');
      setGuestName('');
      setRating(5);
      if (!initialProductId) setSelectedProductId('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={16}
            className={`${
              s <= count ? 'text-[var(--color-gold)] fill-[var(--color-gold)]' : 'text-gray-700'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && setRating(s)}
          />
        ))}
      </div>
    );
  };

  const getProductName = (id: string) => {
    const p = products.find(p => p.id === id);
    return p ? p.name : 'Fragrance';
  };

  return (
    <div className={`mt-24 border-t border-white/5 pt-16 ${!initialProductId ? 'max-w-7xl mx-auto px-6 md:px-12 pb-24' : ''}`}>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
        {/* Review List */}
        <div className="w-full lg:w-2/3 space-y-10">
          <header>
            <h2 className="text-3xl font-serif text-white mb-2">Reflections</h2>
            <p className="text-gray-500 text-xs uppercase tracking-[0.3em]">
              {initialProductId ? 'Client Reviews & Experiences' : 'Voices of the Empire'}
            </p>
          </header>

          {loading ? (
            <div className="flex items-center gap-3 text-gray-500 py-10">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs uppercase tracking-widest">Gathering insights...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-10 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center text-center">
              <MessageSquare size={32} className="text-gray-700 mb-4" />
              <p className="text-gray-500 italic">No reflections shared yet. Be the first to describe this olfactory journey.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0a0a] border border-white/5 p-6 rounded-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <User size={18} className="text-[var(--color-gold)]" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium tracking-wide">{review.user_name}</h4>
                        {!initialProductId && (
                           <p className="text-[9px] text-[var(--color-gold)] uppercase tracking-[0.2em] mt-0.5">
                             on {getProductName(review.product_id)}
                           </p>
                        )}
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">
                          {new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed italic">"{review.comment}"</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-[#070707] border border-[var(--color-gold)]/10 p-8 rounded-sm sticky top-32">
            <h3 className="text-xl font-serif text-white mb-6">Share Your Experience</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!initialProductId && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Select Fragrance</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-black border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select a product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-3">Your Rating</label>
                {renderStars(rating, true)}
              </div>

              {!isAuthenticated && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Your Name</label>
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-black border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Observation</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none"
                  placeholder="Describe the scent, the sillage, the emotion..."
                />
              </div>

              {error && <p className="text-red-500 text-[10px] uppercase tracking-widest">{error}</p>}

              <Button 
                type="submit" 
                className="w-full py-4 h-auto" 
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing...</span>
                  </div>
                ) : (
                  'Publish Reflection'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

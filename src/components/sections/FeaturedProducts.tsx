"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch from our new Express Backend
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section id="collection" className="py-32 bg-[var(--color-dark-surface)] relative min-h-[800px]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-sm tracking-[0.3em] text-[var(--color-gold)] uppercase mb-6">Masterpieces</h2>
                    <p className="text-4xl md:text-5xl font-serif font-light text-white">The Royal Collection</p>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-[var(--color-gold)]">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="uppercase tracking-[0.2em] text-xs">Curating Collection...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500 tracking-widest uppercase py-20">
                        <p>Our collection is currently being prepared.</p>
                        <p className="text-xs mt-2 opacity-50">(Check if the backend server is running and seeded)</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="group relative cursor-pointer"
                            >
                                <Link href={`/product/${product._id || product.id}`}>
                                    {/* Product Card / Image Container */}
                                    <div
                                        className="relative aspect-[4/5] overflow-hidden rounded-sm bg-black border border-white/5 transition-all duration-700 ease-out group-hover:border-[var(--color-gold)]/30 group-hover:shadow-[0_0_40px_rgba(201,169,110,0.1)] flex items-center justify-center p-8"
                                    >
                                        <div
                                            className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-105"
                                            style={{ background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)' }}
                                        />

                                        {/* Glow/Mist on hover */}
                                        <div
                                            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl animate-pulse"
                                            style={{ background: 'radial-gradient(circle at center, rgba(201,169,110,0.2) 0%, transparent 60%)' }}
                                        />

                                        {/* Product Image */}
                                        <div className="relative z-10 w-full h-full flex items-center justify-center group-hover:-translate-y-4 transition-transform duration-700 mix-blend-screen">
                                            <img
                                                src={product.images?.[0] || '/images/hero.png'}
                                                alt={product.name}
                                                className="max-h-full object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="mt-8 text-center flex flex-col items-center">
                                        <h3 className="text-2xl font-serif text-white mb-2">{product.name}</h3>
                                        <p className="text-sm tracking-widest text-gray-400 uppercase mb-4">{product.category}</p>
                                        <div className="w-8 h-[1px] bg-[var(--color-gold)]/50 mb-4" />
                                        <p className="text-white tracking-widest mb-6">${product.price}</p>

                                        <div className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium transition-all duration-500 delay-100 border border-white/20 text-white hover:bg-white hover:text-black opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 rounded-sm">
                                            Discover
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

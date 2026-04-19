"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/store/useCart';

export default function ProductDetails({ product }: { product: any }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const { addItem, setIsOpen } = useCart();

    const handleAddToCart = () => {
        addItem({
            id: product._id || product.id,
            name: product.name,
            price: Number(product.price.toString().replace('$', '')),
            displayPrice: product.price.toString(),
            imageUrl: product.imageUrl,
            quantity: 1,
        });
        setIsOpen(true); // Open the drawer so user sees carting details effortlessly
    };

    return (
        <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-[calc(100vh-200px)] flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Left Column: Image Gallery with Zoom */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 relative">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative aspect-[3/4] w-full bg-[#0a0a0a] rounded-sm overflow-hidden flex items-center justify-center border border-white/5 cursor-zoom-in group"
                    onClick={() => setIsZoomed(!isZoomed)}
                    onMouseLeave={() => setIsZoomed(false)}
                >
                    {/* Animated Mist Background */}
                    <div
                        className="absolute inset-0 z-0 opacity-50 blur-3xl animate-pulse"
                        style={{ background: `radial-gradient(circle at center, ${product.mistColor} 0%, transparent 70%)` }}
                    />
                    <div
                        className="absolute inset-0 z-0 transition-transform duration-1000"
                        style={{ background: product.imagePlaceholder }}
                    />

                    {/* Product Image */}
                    <motion.div
                        animate={{ scale: isZoomed ? 1.5 : 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative z-10 w-full h-[80%] flex items-center justify-center mix-blend-screen drop-shadow-2xl pointer-events-none"
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full object-contain"
                        />
                    </motion.div>

                    {!isZoomed && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase text-gray-500 tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to Zoom
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Right Column: Product Details */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 flex flex-col justify-center"
            >
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-serif text-white">{product.name}</h1>
                    <p className="text-2xl text-[var(--color-gold-light)] font-light tracking-widest">{product.price}</p>

                    <div className="w-12 h-px bg-[var(--color-gold)]/40" />

                    <p className="text-gray-400 font-light leading-relaxed text-lg pb-4">
                        {product.description}
                    </p>

                    <div className="space-y-6 pt-4 border-t border-white/10">
                        <div>
                            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Key Notes</h3>
                            <p className="text-sm text-gray-300 tracking-widest uppercase">{product.notes}</p>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Best Worn For</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.occasions?.map((occ: string) => (
                                    <span key={occ} className="px-4 py-1.5 border border-white/10 rounded-full text-xs text-gray-400 uppercase tracking-[0.15em]">
                                        {occ}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button size="lg" className="w-full md:w-auto min-w-[200px]" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

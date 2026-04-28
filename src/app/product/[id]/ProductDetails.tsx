"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/store/useCart';
import Link from 'next/link';

export default function ProductDetails({ product }: { product: any }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { addItem, setIsOpen } = useCart();

    const handleAddToCart = () => {
        addItem({
            id: product._id || product.id,
            name: product.name,
            price: Number(product.price.toString().replace('PKR ', '')),
            displayPrice: product.price.toString(),
            imageUrl: product.imageUrl,
            quantity: quantity,
        });
        setIsOpen(true);
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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.25)_0%,transparent_70%)] animate-pulse z-0" />
                    
                    <div
                        className="absolute inset-0 z-0 transition-transform duration-1000 opacity-20"
                        style={{ background: product.imagePlaceholder }}
                    />

                    <motion.div
                        animate={{ scale: isZoomed ? 1.5 : 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-2xl"
                    >
                        <img
                            src={product.imageUrl || '/images/hero.png'}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                        />
                    </motion.div>

                    {!isZoomed && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase text-gray-400 tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
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

                    <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex items-center border border-white/10 rounded-sm h-14">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-5 h-full text-gray-400 hover:text-white transition-colors border-r border-white/5"
                            >
                                −
                            </button>
                            <span className="w-12 text-center text-white font-medium">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-5 h-full text-gray-400 hover:text-white transition-colors border-l border-white/5"
                            >
                                +
                            </button>
                        </div>

                        <Button size="lg" className="w-full md:w-auto min-w-[200px] h-14" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">Need Assistance?</p>
                        <Link 
                            href="mailto:seyalimperial@gmail.com" 
                            className="text-sm text-[var(--color-gold-light)] hover:text-white transition-colors"
                        >
                            seyalimperial@gmail.com
                        </Link>
                        <Link 
                            href="https://wa.me/923019123717"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--color-gold-light)] hover:text-white transition-colors"
                        >
                            WhatsApp: +92 301 9123717
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

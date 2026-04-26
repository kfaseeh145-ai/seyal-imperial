"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function Hero() {
    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-20">
            {/* Background Mist Animation & Overlay - Updated to Golden Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1306]/80 via-black/40 to-black z-10" />

                {/* Strong Golden Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,rgba(0,0,0,1)_80%)] animate-mist origin-center z-0" />

                {/* Second mist layer */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.05)_0%,transparent_60%)] animate-pulse z-0" style={{ animationDuration: '8s' }} />
            </div>

            <div className="relative z-20 flex flex-col md:flex-row items-center w-full max-w-7xl mx-auto px-6 md:px-12 gap-12 md:gap-4 mt-8">

                {/* Left Content: Text */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full md:w-1/2 space-y-6 text-center md:text-left z-30"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-[var(--color-gold)] text-xs md:text-sm tracking-[0.3em] uppercase drop-shadow-md"
                    >
                        Introducing the Collection
                    </motion.span>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white leading-[1.1]">
                        Crafted for <span className="text-gradient font-normal italic drop-shadow-xl">Presence.</span><br />
                        Designed for <span className="font-normal">Memory.</span>
                    </h1>

                    <p className="text-gray-300 text-base md:text-lg font-light max-w-lg mx-auto md:mx-0 pt-4 pb-6 drop-shadow-md">
                        Seyal Impérial is a luxury fragrance house inspired by Arabian heritage and modern elegance. We create bold and refined scents designed to express identity, confidence, and timeless style. Each fragrance is crafted to leave a lasting impression. <span className="text-[var(--color-gold)] italic">More than a scent… a statement.</span>
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <Button 
                            size="lg" 
                            className="tracking-[0.2em] relative overflow-hidden group"
                            onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Collection
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Right Content: Product Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="w-full md:w-1/2 h-[50vh] md:h-[75vh] relative flex items-center justify-center pointer-events-none"
                >
                    {/* Golden Glow Behind Bottle */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.3)_0%,transparent_60%)] animate-pulse" />

                    {/* The Image with CSS Mask to remove black box bounds */}
                    <img
                        src="/images/hero_imperial.PNG"
                        alt="Seyal Imperial Signature"
                        className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_30px_rgba(201,169,110,0.3)] opacity-90"

                        style={{
                            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 65%)',
                            maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 65%)'
                        }}
                    />
                </motion.div>

            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-[var(--color-gold-light)] text-[10px] tracking-[0.2em] uppercase">Scroll</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-[var(--color-gold)] to-transparent" />
            </motion.div>
        </section>
    );
}

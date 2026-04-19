"use client";

import { motion } from 'framer-motion';

export function BrandStory() {
    return (
        <section id="story" className="py-32 relative overflow-hidden bg-black">
            {/* Decorative Gold Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-px bg-gradient-to-l from-[var(--color-gold)]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-[var(--color-gold)]/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-20">

                {/* Abstract Imagery / Visual */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="w-full lg:w-1/2"
                >
                    <div className="relative aspect-square md:aspect-[4/3] w-full border border-white/10 rounded-sm overflow-hidden p-4 group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,169,110,0.08)_0%,transparent_60%)] z-10" />

                        {/* Image Placeholder representing heritage */}
                        <div className="w-full h-full bg-[#111] overflow-hidden relative">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-40 mix-blend-overlay"
                                style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <div className="w-32 h-32 border border-[var(--color-gold)]/30 rounded-full flex items-center justify-center relative">
                                    <div className="absolute w-full h-full border border-[var(--color-gold)]/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                                    <span className="font-serif text-[var(--color-gold)] text-4xl">S</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="w-full lg:w-1/2 space-y-8"
                >
                    <h2 className="text-sm tracking-[0.3em] text-[var(--color-gold)] uppercase">Our Heritage</h2>
                    <h3 className="text-4xl md:text-5xl font-serif font-light text-white leading-tight">
                        Crafted for those who leave a <span className="italic text-gradient">lasting mark.</span>
                    </h3>

                    <div className="space-y-6 text-gray-400 font-light text-lg leading-relaxed">
                        <p>
                            Seyal Imperial was born from a singular vision: to create fragrances that don't just smell extraordinary, but actively sculpt your presence in the room.
                        </p>
                        <p>
                            We source the rarest ingredients from the hidden corners of the globe. From the deep, resinous oud of Southeast Asia to the delicate, hand-picked roses of Grasse, every note is a testament to uncompromising luxury.
                        </p>
                    </div>

                    <div className="pt-8 pt-border-t border-white/10">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-3xl font-serif text-white mb-2">24<span className="text-[var(--color-gold)]">%</span></p>
                                <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">Oil Concentration</p>
                            </div>
                            <div>
                                <p className="text-3xl font-serif text-white mb-2">12<span className="text-[var(--color-gold)]">+</span></p>
                                <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">Hours of Longevity</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

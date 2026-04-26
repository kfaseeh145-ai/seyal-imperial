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
                        <div className="w-full h-full bg-[#0a0a0a] overflow-hidden relative flex items-center justify-center">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
                                }}
                            />
                            {/* Pulsing glow behind logo */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 rounded-full bg-[var(--color-gold)]/5 animate-pulse" style={{ animationDuration: '4s' }} />
                            </div>
                            {/* Actual Logo */}
                            <img
                                src="/images/logo.png"
                                alt="Seyal Impérial Crest"
                                className="relative z-10 w-80 h-auto object-contain drop-shadow-[0_0_40px_rgba(201,169,110,0.3)]"
                            />
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
                            Seyal Impérial was created to turn fragrance into identity. Inspired by Arab luxury and modern elegance, each scent is crafted to leave a lasting impression—bold, refined, and unforgettable.
                        </p>
                        <p>
                            From Imperial Oud to Signature Sheikh and Femme Royale, every fragrance tells a story of confidence, power, and elegance.
                        </p>
                        <p>
                            Not just a perfume house—this is presence in a bottle.
                        </p>
                        <p className="text-white font-light mt-10">
                            Seyal Impérial — <span className="text-[var(--color-gold)] italic">Wear Your Legacy.</span>
                        </p>
                    </div>


                    <div className="pt-8 pt-border-t border-white/10">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-3xl font-serif text-white mb-2">45<span className="text-[var(--color-gold)]">%</span></p>
                                <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">Oil Concentration</p>
                            </div>

                            <div>
                                <p className="text-3xl font-serif text-white mb-2">24<span className="text-[var(--color-gold)]">+</span></p>
                                <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">Hours of Longevity</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

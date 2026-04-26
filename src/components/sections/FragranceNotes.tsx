"use client";

import { motion } from 'framer-motion';

const notes = [
    {
        title: "Top Notes",
        description: "The opening is fresh and captivating, a first impression that draws you in with brightness and elegance.",
        ingredients: "Bergamot · Cardamom · Saffron",
        delay: 0.1,
    },
    {
        title: "Heart Notes",
        description: "At the core, the fragrance reveals its true character—rich, expressive, and refined, leaving a lasting emotional signature.",
        ingredients: "Damask Rose · Jasmine · Leather",
        delay: 0.3,
    },
    {
        title: "Base Notes",
        description: "Deep and powerful, the foundation lingers on the skin—warm, sensual, and undeniably luxurious.",
        ingredients: "Oud · Amber · Dark Woods",
        delay: 0.5,
    }
];

export function FragranceNotes() {
    return (
        <section className="py-32 bg-[var(--color-dark-surface)] relative border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <h2 className="text-sm tracking-[0.3em] text-[var(--color-gold)] uppercase mb-6">The Anatomy of Luxury</h2>
                    <p className="text-4xl md:text-5xl font-serif font-light text-white">Symphony of Notes</p>
                </motion.div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent -z-10" />

                    {notes.map((note, idx) => (
                        <motion.div
                            key={note.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: note.delay }}
                            className="w-full md:w-1/3 flex flex-col items-center"
                        >
                            <div className="w-24 h-24 rounded-full border border-[var(--color-gold)]/40 flex items-center justify-center bg-black mb-8 shadow-[0_0_30px_rgba(201,169,110,0.1)] relative group">
                                {/* Number indicator */}
                                <span className="font-serif text-3xl text-[var(--color-gold)] group-hover:scale-110 transition-transform duration-500">
                                    {idx + 1}
                                </span>
                                <div className="absolute inset-0 border border-[var(--color-gold)]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                            </div>

                            <h3 className="text-xl font-serif tracking-widest text-white uppercase mb-4">{note.title}</h3>
                            <p className="text-gray-400 font-light text-sm mb-6 max-w-[280px]">
                                {note.description}
                            </p>

                            <div className="text-[var(--color-gold-light)] font-serif italic text-lg opacity-80">
                                {note.ingredients}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

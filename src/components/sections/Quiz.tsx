"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const questions = [
    {
        id: 1,
        question: "What vibe do you prefer?",
        options: [
            { label: "Calm & elegant", value: "A" },
            { label: "Bold & attention-grabbing", value: "B" },
        ]
    },
    {
        id: 2,
        question: "What kind of scent do you like?",
        options: [
            { label: "Floral / clean", value: "A" },
            { label: "Oud / woody", value: "B" },
        ]
    },
    {
        id: 3,
        question: "What impression do you want to leave?",
        options: [
            { label: "Grace & charm", value: "A" },
            { label: "Power & presence", value: "B" },
        ]
    }
];

export function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (value: string) => {
        const newAnswers = [...answers, value];
        if (currentQuestion < questions.length - 1) {
            setAnswers(newAnswers);
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setAnswers(newAnswers);
            setShowResult(true);
        }
    };

    const getResult = () => {
        const countA = answers.filter(a => a === "A").length;
        const countB = answers.filter(a => a === "B").length;

        if (countA === 3) {
            return { 
                name: "Femme Royale", 
                desc: "The epitome of majestic elegance. A symphony of bright florals and warm amber for those who value grace and charm." 
            };
        } else if (countB === 3) {
            return { 
                name: "Imperial Oud", 
                desc: "The pinnacle of power. A deep, commanding blend of pure oud and dark woods for a presence that cannot be ignored." 
            };
        } else {
            return { 
                name: "Signature Sheikh", 
                desc: "A perfect balance of command and sophistication. A masterpiece of rich oud blended with spicy cardamom and leather." 
            };
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResult(false);
    };

    return (
        <section id="quiz" className="py-32 bg-black relative border-y border-white/5 overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom,rgba(201,169,110,0.05)_0%,transparent_60%)]" />

            <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
                <h2 className="text-sm tracking-[0.3em] text-[var(--color-gold)] uppercase mb-6">Fragrance Finder</h2>
                <p className="text-4xl md:text-5xl font-serif font-light text-white mb-16">Discover Your Signature</p>

                <div className="bg-[#0a0a0a] border border-[var(--color-gold)]/20 p-8 md:p-12 rounded-sm shadow-2xl min-h-[400px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {!showResult ? (
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-10"
                            >
                                <div className="flex justify-center gap-2 mb-8">
                                    {questions.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 w-12 rounded-full transition-colors duration-500 ${idx <= currentQuestion ? 'bg-[var(--color-gold)]' : 'bg-white/10'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <h3 className="text-2xl font-serif text-white mb-8">{questions[currentQuestion].question}</h3>

                                <div className="space-y-4 flex flex-col items-center">
                                    {questions[currentQuestion].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(option.value)}
                                            className="w-full max-w-md p-6 border border-white/10 text-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all duration-300 uppercase tracking-widest text-xs rounded-sm hover:bg-[var(--color-gold)]/5"
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <h3 className="text-sm tracking-[0.2em] text-[var(--color-gold)] uppercase">Your Perfect Match</h3>
                                <h4 className="text-4xl font-serif text-white">{getResult().name}</h4>
                                <p className="text-gray-400 font-light max-w-md mx-auto">{getResult().desc}</p>

                                <div className="pt-8 flex flex-col items-center gap-4">
                                    <Button variant="primary" className="w-full max-w-xs">Explore {getResult().name}</Button>
                                    <button onClick={resetQuiz} className="text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors mt-4">
                                        Retake Quiz
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

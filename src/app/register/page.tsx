"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                        role: 'user'
                    }
                }
            });

            if (authError) throw new Error(authError.message);
            
            setEmailSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-[#050505]">
            <div className="w-full max-w-md p-8 bg-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-hidden">
                {/* Decorative border line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-50" />

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif text-white tracking-wide mb-2">
                        {emailSent ? "Verify Email" : "Create Masterpiece"}
                    </h1>
                    <p className="text-gray-500 tracking-widest uppercase text-xs">
                        {emailSent ? "Check your inbox for a secure link" : "Establish your presence within the empire"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {emailSent ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 py-10"
                    >
                        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[var(--color-gold)]/10 rounded-full animate-ping" />
                            <div className="relative z-10 w-full h-full border border-[var(--color-gold)]/30 rounded-full flex items-center justify-center bg-black">
                                <KeyRound className="text-[var(--color-gold)] w-8 h-8" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-serif text-white tracking-wide">Verification Sent</h2>
                            <p className="text-[var(--color-gold-light)] text-sm leading-relaxed max-w-[280px] mx-auto">
                                A secure activation link has been dispatched to <br/>
                                <span className="font-bold text-white block mt-1">{email}</span>
                            </p>
                        </div>

                        <div className="pt-4 space-y-4">
                            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">
                                Please check your inbox & spam folder
                            </p>
                            <Button
                                onClick={() => router.push('/login')}
                                variant="outline"
                                className="w-full border-white/10 hover:border-[var(--color-gold)]/50"
                            >
                                Return to Access Portal
                            </Button>
                        </div>
                    </motion.div>
                ) : (

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 tracking-widest uppercase text-sm group transition-all"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>
                )}

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <span className="text-gray-500 text-sm">Already a member of the elite? </span>
                    <Link href="/login" className="text-[var(--color-gold)] hover:text-white transition-colors text-sm font-medium tracking-wide">
                        Access Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}

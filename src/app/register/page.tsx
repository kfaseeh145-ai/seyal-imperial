"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationMode, setVerificationMode] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // If the backend simulated bypass or normally requested verification
                setVerificationMode(true);
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (res.ok) {
                // Instantly log them in with the real token that was just granted
                login(data);
                
                // If they are admin, warp them straight to dashboard
                if (data.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                throw new Error(data.message || 'Invalid verification code');
            }
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
                        {verificationMode ? "Identity Verification" : "Create Masterpiece"}
                    </h1>
                    <p className="text-gray-500 tracking-widest uppercase text-xs">
                        {verificationMode ? "Enter the 6-digit transmission code" : "Establish your presence within the empire"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {verificationMode ? (
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="text-center text-sm text-[var(--color-gold-light)] mb-8">
                            A secure access code has been dispatched to <br/><span className="font-bold text-white">{email}</span>.
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Access Code</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors text-center tracking-[0.5em] font-mono text-xl"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 tracking-widest uppercase text-sm group transition-all"
                            disabled={loading || code.length !== 6}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Confirm Identity'}
                        </Button>
                    </form>
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

                {!verificationMode && (
                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <span className="text-gray-500 text-sm">Already a member of the elite? </span>
                        <Link href="/login" className="text-[var(--color-gold)] hover:text-white transition-colors text-sm font-medium tracking-wide">
                            Access Portal
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

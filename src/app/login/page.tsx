"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const login = useAuth((state) => state.login);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw new Error(authError.message);
            if (!data.user) throw new Error('No user data returned');

            const userName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
            const userEmail = data.user.email!;
            const userRole = (data.user.user_metadata?.role as any) || 'user';

            // Sync with public.profiles table so Admin can see names
            await supabase.from('profiles').upsert({
                id: data.user.id,
                name: userName,
                email: userEmail,
                updated_at: new Date().toISOString()
            });

            login({
                id: data.user.id,
                name: userName,
                email: userEmail,
                role: userRole,
                token: data.session?.access_token
            });

            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center pt-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#0a0a0a] p-8 border border-white/5 rounded-sm"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">Enter your credentials</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 mb-6 text-center rounded-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                        />
                    </div>

                    <Button size="lg" className="w-full" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Don't have an account? <Link href="/register" className="text-[var(--color-gold)] hover:underline">Register here</Link>
                </p>
            </motion.div>
        </section>
    );
}

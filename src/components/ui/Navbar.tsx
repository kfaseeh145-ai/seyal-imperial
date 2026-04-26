"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Menu, X, Package } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useAuth } from '@/store/useAuth';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { setIsOpen, items } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    
    // Calculate total quantity across all items
    const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Collection', href: '/#collection' },
        { name: 'Story', href: '/#story' },
        { name: 'Fragrance Finder', href: '/#quiz' },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Brand Logo */}
                <Link href="/" className="transform md:translate-x-12 flex items-center">
                    <img
                        src="/images/logo.png"
                        alt="Seyal Impérial"
                        className="h-14 md:h-16 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs tracking-[0.15em] text-gray-400 hover:text-[var(--color-gold)] transition-colors uppercase"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {!isAuthenticated ? (
                        <Link href="/login" className="text-xs tracking-[0.15em] text-gray-400 hover:text-[var(--color-gold)] transition-colors uppercase">
                            Login
                        </Link>
                    ) : (
                        <div className="flex items-center gap-6">
                            {user?.role === 'admin' && (
                                <Link href="/admin" className="text-xs tracking-[0.15em] text-[var(--color-gold)] font-bold transition-colors uppercase">
                                    Admin
                                </Link>
                            )}
                            <button onClick={logout} className="text-xs tracking-[0.15em] text-gray-400 hover:text-[var(--color-red)] cursor-pointer transition-colors uppercase">
                                Logout
                            </button>
                        </div>
                    )}
                </nav>

                {/* Icons Group */}
                <div className="flex items-center gap-6">
                    {/* Orders (Authenticated only) */}
                    {isAuthenticated && (
                        <Link 
                            href="/orders"
                            className="text-white hover:text-[var(--color-gold)] transition-colors relative flex items-center gap-2 group cursor-pointer"
                        >
                            <span className="text-xs tracking-widest hidden md:inline-block uppercase text-gray-400 group-hover:text-[var(--color-gold)] transition-colors">Orders</span>
                            <Package size={20} strokeWidth={1.5} />
                        </Link>
                    )}

                    {/* Cart */}
                    <button 
                        className="text-white hover:text-[var(--color-gold)] transition-colors relative flex items-center gap-2 group cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        <span className="text-xs tracking-widest hidden md:inline-block uppercase text-gray-400 group-hover:text-[var(--color-gold)] transition-colors">Cart</span>
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-[var(--color-gold)] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10"
                >
                    <div className="flex flex-col px-6 py-6 gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm tracking-widest text-gray-300 hover:text-[var(--color-gold)] transition-colors uppercase py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <div className="h-px bg-white/5 my-2" />

                        {!isAuthenticated ? (
                            <Link
                                href="/login"
                                className="text-sm tracking-widest text-[var(--color-gold)] hover:text-white transition-colors uppercase py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login / Register
                            </Link>
                        ) : (
                            <>
                                {user?.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="text-sm tracking-widest text-[var(--color-gold)] font-bold transition-colors uppercase py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-sm tracking-widest text-left text-gray-400 hover:text-[var(--color-red)] transition-colors uppercase py-2"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}

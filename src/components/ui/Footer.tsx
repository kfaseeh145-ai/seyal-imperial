import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-black py-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12">
                <div>
                    <h2 className="text-2xl font-serif text-white tracking-[0.2em] mb-4">SEYAL IMPÉRIAL</h2>
                    <p className="text-gray-500 text-sm tracking-widest uppercase">The Essence of Luxury</p>
                </div>

                <div className="flex gap-8">
                    {['Instagram', 'Facebook', 'Twitter', 'TikTok'].map((social) => (
                        <Link
                            key={social}
                            href="#"
                            className="text-xs text-gray-400 hover:text-[var(--color-gold)] uppercase tracking-widest transition-colors"
                        >
                            {social}
                        </Link>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/10 w-full max-w-md flex flex-col items-center gap-4">
                    <p className="text-xs text-gray-600 uppercase tracking-widest">
                        © {new Date().getFullYear()} Seyal Imperial. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

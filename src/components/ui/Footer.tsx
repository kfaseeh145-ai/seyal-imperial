import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-black py-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12">
                <div>
                    <h2 className="text-2xl font-serif text-white tracking-[0.2em] mb-4">SEYAL IMPÉRIAL</h2>
                    <p className="text-gray-500 text-sm tracking-widest uppercase">The Essence of Luxury</p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    <Link
                        href="https://www.tiktok.com/@seyal.imperial?_r=1&_t=ZS-95kQ8QU87lo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-[var(--color-gold)] uppercase tracking-widest transition-colors"
                    >
                        TikTok
                    </Link>
                    <Link
                        href="https://x.com/seyalimperial?s=21"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-[var(--color-gold)] uppercase tracking-widest transition-colors"
                    >
                        X
                    </Link>
                    <Link
                        href="https://www.instagram.com/seyal.imperial?igsh=ZmdteTc1bTI0bXZi&utm_source=qr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-[var(--color-gold)] uppercase tracking-widest transition-colors"
                    >
                        Instagram
                    </Link>
                    <Link
                        href="https://www.facebook.com/share/1FCGpiYYKR/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-[var(--color-gold)] uppercase tracking-widest transition-colors"
                    >
                        Facebook
                    </Link>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-gold)]">Contact Us</p>
                    <a 
                        href="mailto:seyalimperial@gmail.com" 
                        className="text-white hover:text-[var(--color-gold)] transition-colors tracking-widest text-sm"
                    >
                        seyalimperial@gmail.com
                    </a>
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

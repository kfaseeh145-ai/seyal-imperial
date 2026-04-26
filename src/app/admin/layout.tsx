import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#050505] pt-24 md:pt-[104px]">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black p-6 hidden md:block h-full min-h-[calc(100vh-104px)]">
                <h2 className="text-xl font-serif text-[var(--color-gold)] mb-10 tracking-widest uppercase mt-4">Command Center</h2>
                <nav className="flex flex-col gap-6">
                    <Link href="/admin" className="text-gray-400 hover:text-white tracking-widest text-sm uppercase transition-colors">Order History</Link>
                    <Link href="/admin/products" className="text-gray-400 hover:text-white tracking-widest text-sm uppercase transition-colors">Product Manager</Link>
                    <Link href="/admin/reviews" className="text-gray-400 hover:text-white tracking-widest text-sm uppercase transition-colors">Client Reviews</Link>
                    <Link href="/" className="text-gray-600 hover:text-[var(--color-gold)] tracking-widest text-sm uppercase mt-10 transition-colors">Exit Portal</Link>
                </nav>
            </aside>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center justify-start border-b border-white/5 bg-black px-4 py-4 gap-3 overflow-x-auto snap-x">
                <Link href="/admin" className="text-gray-400 hover:text-[var(--color-gold)] tracking-widest text-[10px] uppercase px-4 py-2 border border-white/10 rounded-sm whitespace-nowrap transition-colors">Order History</Link>
                <Link href="/admin/products" className="text-gray-400 hover:text-[var(--color-gold)] tracking-widest text-[10px] uppercase px-4 py-2 border border-white/10 rounded-sm whitespace-nowrap transition-colors">Products</Link>
                <Link href="/admin/reviews" className="text-gray-400 hover:text-[var(--color-gold)] tracking-widest text-[10px] uppercase px-4 py-2 border border-white/10 rounded-sm whitespace-nowrap transition-colors">Reviews</Link>
                <Link href="/" className="text-gray-600 hover:text-white tracking-widest text-[10px] uppercase px-4 py-2 whitespace-nowrap transition-colors">Exit</Link>
            </div>

            <main className="flex-1 p-4 md:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

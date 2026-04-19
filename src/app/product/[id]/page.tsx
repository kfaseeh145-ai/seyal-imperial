import { notFound } from 'next/navigation';
import ProductDetails from './ProductDetails';

// Force dynamic fetching so it doesn't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id; 
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`;
        
        const res = await fetch(url, { cache: 'no-store' });
        
        if (!res.ok) {
            return (
                <div className="pt-40 flex items-center justify-center text-white flex-col">
                    <h1 className="text-3xl text-red-500">Failed to fetch API</h1>
                    <p>Status: {res.status}</p>
                    <p>URL: {url}</p>
                </div>
            );
        }
        
        const dbProduct = await res.json();
        
        // ... mapping
        const product = {
            ...dbProduct,
            imageUrl: dbProduct.images?.[0] || '/images/hero.png',
            price: `$${dbProduct.price}`,
            notes: dbProduct.notes ? `${dbProduct.notes.top}, ${dbProduct.notes.heart}, ${dbProduct.notes.base}` : 'No notes available',
            occasions: ['Signature', dbProduct.category || 'Luxury'],
            mistColor: 'rgba(201,169,110,0.3)',
            imagePlaceholder: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)'
        };

        return <ProductDetails product={product} />;
    } catch (error: any) {
        return (
            <div className="pt-40 flex items-center justify-center text-white flex-col">
                <h1 className="text-3xl text-red-500">Network Exception</h1>
                <p>Message: {error.message}</p>
            </div>
        );
    }
}

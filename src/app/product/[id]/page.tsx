import { supabase } from '@/lib/supabase';
import ProductDetails from './ProductDetails';

// Force dynamic fetching so it doesn't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id; 

        const { data: dbProduct, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error || !dbProduct) {
            return (
                <div className="pt-40 flex items-center justify-center text-white flex-col">
                    <h1 className="text-3xl text-red-500">Product not found</h1>
                    <p>The fragrance empire could not find this scent.</p>
                </div>
            );
        }

        
        // ... mapping
        const product = {
            ...dbProduct,
            imageUrl: dbProduct.images?.[0] || '/images/hero.png',
            price: `PKR ${dbProduct.price}`,
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

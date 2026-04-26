"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, UploadCloud, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';

export default function EditProduct() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const productId = params?.id;

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [topNote, setTopNote] = useState('');
    const [heartNote, setHeartNote] = useState('');
    const [baseNote, setBaseNote] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Load existing product data
    useEffect(() => {
        if (!productId) return;
        const load = async () => {
            try {
                const res = await fetch(`/api/products/${productId}`);
                if (!res.ok) throw new Error('Product not found');
                const p = await res.json();
                setName(p.name || '');
                setPrice(String(p.price || ''));
                setDescription(p.description || '');
                setCategory(p.category || 'The Royal Collection');
                setStock(String(p.stock || '50'));
                setTopNote(p.notes?.top || '');
                setHeartNote(p.notes?.heart || '');
                setBaseNote(p.notes?.base || '');
                setCurrentImageUrl(p.images?.[0] || '');
                setPreviewUrl(p.images?.[0] || '');
            } catch (err: any) {
                setError(err.message);
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [productId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setUploading(true);

        try {
            // Step 1: Upload new image if one was selected
            let imageUrl = currentImageUrl;

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw new Error(uploadError.message);

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);
                
                imageUrl = publicUrl;
            }

            // Step 2: Update the product via internal API
            const productRes = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    price: Number(price),
                    description,
                    images: [imageUrl],
                    category,
                    stock: Number(stock),
                    notes: { top: topNote, heart: heartNote, base: baseNote },
                }),
            });

            if (!productRes.ok) {
                const d = await productRes.json();
                throw new Error(d.message || 'Failed to update product');
            }

            setSuccess(true);
            setTimeout(() => router.push('/admin/products'), 1200);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };


    if (!user || user.role !== 'admin') return <Loader2 className="animate-spin text-[var(--color-gold)]" />;

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--color-gold)]">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="uppercase tracking-widest text-xs">Loading product…</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <Link href="/admin/products" className="text-gray-500 hover:text-[var(--color-gold)] transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Products
                </Link>
            </div>

            <h1 className="text-3xl font-serif text-white tracking-wide mb-8">
                Edit <span className="text-[var(--color-gold)] italic">Masterpiece</span>
            </h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 mb-8 rounded-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 mb-8 rounded-sm text-center tracking-widest uppercase text-xs">
                    ✓ Product updated — redirecting…
                </div>
            )}

            <form onSubmit={submitHandler} className="bg-[#0a0a0a] border border-white/5 rounded-sm p-8 shadow-2xl flex flex-col md:flex-row gap-12">

                {/* Left Column - Image Upload */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Product Image</label>
                    <div className="relative aspect-[3/4] border-2 border-dashed border-white/10 rounded-sm flex items-center justify-center bg-black overflow-hidden group cursor-pointer hover:border-[var(--color-gold)] transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            onChange={handleImageChange}
                        />
                        {previewUrl ? (
                            <img src={previewUrl} className="w-full h-full object-cover z-10 opacity-80 group-hover:scale-105 transition-transform duration-500" alt="preview" />
                        ) : (
                            <div className="text-center p-4 z-10 flex flex-col items-center">
                                <UploadCloud className="w-8 h-8 text-gray-600 mb-2 group-hover:text-[var(--color-gold)] transition-colors" />
                                <span className="text-xs text-gray-500 tracking-widest uppercase">Replace Image</span>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-600 tracking-widest uppercase text-center">Click to replace current image</p>
                </div>

                {/* Right Column - Data */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Perfume Name</label>
                            <input
                                required type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Price (PKR)</label>
                            <input
                                required type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Description</label>
                        <textarea
                            required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Category</label>
                            <input
                                type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Stock</label>
                            <input
                                type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                                className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6 mt-6">
                        <div className="col-span-3 text-xs uppercase tracking-widest text-[var(--color-gold)] mb-2">The Olfactory Pyramid</div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Top Notes</label>
                            <input
                                type="text" value={topNote} onChange={(e) => setTopNote(e.target.value)} placeholder="e.g. Bergamot"
                                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Heart Notes</label>
                            <input
                                type="text" value={heartNote} onChange={(e) => setHeartNote(e.target.value)} placeholder="e.g. Rose"
                                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Base Notes</label>
                            <input
                                type="text" value={baseNote} onChange={(e) => setBaseNote(e.target.value)} placeholder="e.g. Amber"
                                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <Link href="/admin/products" className="flex-1">
                            <Button variant="outline" className="w-full" type="button">Cancel</Button>
                        </Link>
                        <Button className="flex-1 font-serif tracking-widest uppercase" disabled={uploading}>
                            {uploading ? 'Saving Changes…' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}

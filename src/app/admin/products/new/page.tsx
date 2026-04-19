"use client";

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { Loader2, UploadCloud, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function NewProduct() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    
    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('The Royal Collection');
    const [stock, setStock] = useState('50');
    
    // Nested Object State for Notes
    const [topNote, setTopNote] = useState('');
    const [heartNote, setHeartNote] = useState('');
    const [baseNote, setBaseNote] = useState('');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

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
            // Step 1: Upload the Image to Cloudinary via backend
            let imageUrl = '/images/sheikh.png'; // Fallback
            
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    },
                    body: formData
                });
                
                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadData.message || "Failed to upload image");
                
                imageUrl = uploadData.url;
            }

            // Step 2: Post the complete product to MongoDB
            const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    name,
                    price: Number(price),
                    description,
                    images: [imageUrl],
                    category,
                    stock: Number(stock),
                    notes: {
                        top: topNote,
                        heart: heartNote,
                        base: baseNote
                    }
                })
            });

            if (!productRes.ok) {
                const prodData = await productRes.json();
                throw new Error(prodData.message || "Failed to create product");
            }

            // Success
            router.push('/admin/products');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (!user || user.role !== 'admin') return <Loader2 className="animate-spin text-[var(--color-gold)]" />;

    return (
        <div className="w-full max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <Link href="/admin/products" className="text-gray-500 hover:text-[var(--color-gold)] transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Products
                </Link>
            </div>

            <h1 className="text-3xl font-serif text-white tracking-wide mb-8">
                Create <span className="text-[var(--color-gold)] italic">Masterpiece</span>
            </h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 mb-8 rounded-sm">
                    {error}
                </div>
            )}

            <form onSubmit={submitHandler} className="bg-[#0a0a0a] border border-white/5 rounded-sm p-8 shadow-2xl flex flex-col md:flex-row gap-12">
                
                {/* Left Column - Image Upload */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Master Image</label>
                    <div className="relative aspect-[3/4] border-2 border-dashed border-white/10 rounded-sm flex items-center justify-center bg-black overflow-hidden group cursor-pointer hover:border-[var(--color-gold)] transition-colors">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            onChange={handleImageChange}
                        />
                        {previewUrl ? (
                            <img src={previewUrl} className="w-full h-full object-cover z-10 opacity-80 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="text-center p-4 z-10 flex flex-col items-center">
                                <UploadCloud className="w-8 h-8 text-gray-600 mb-2 group-hover:text-[var(--color-gold)] transition-colors" />
                                <span className="text-xs text-gray-500 tracking-widest uppercase">Select Image</span>
                            </div>
                        )}
                    </div>
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
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Price ($)</label>
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

                    <div className="pt-8">
                        <Button className="w-full font-serif tracking-widest uppercase" disabled={uploading}>
                            {uploading ? 'Archiving Masterpiece...' : 'Publish to Catalog'}
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}

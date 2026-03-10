'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { compressImage } from '@/lib/imageUtils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Plus, Trash2, Image as ImageIcon, Upload, Loader2, X, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ChildSku {
    id: string;
    child_sku: string;
    size: string;
    color: string;
}

interface ImageFile {
    id: string;
    file: File;
    preview: string;
}

export default function AddProductPage() {
    const { user } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        product_name: '',
        parent_sku: '',
        description: '',
        mrp: '',
        category: '',
        image_url: '', // Added image URL
    });
    const [childSkus, setChildSkus] = useState<ChildSku[]>([
        { id: crypto.randomUUID(), child_sku: '', size: '', color: '' },
    ]);
    const [images, setImages] = useState<ImageFile[]>([]);

    const addChildSku = () => {
        setChildSkus((prev) => [...prev, { id: crypto.randomUUID(), child_sku: '', size: '', color: '' }]);
    };

    const removeChildSku = (id: string) => {
        setChildSkus((prev) => prev.filter((s) => s.id !== id));
    };

    const updateChildSku = (id: string, field: keyof ChildSku, value: string) => {
        setChildSkus((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages: ImageFile[] = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (id: string) => {
        setImages((prev) => {
            const removed = prev.find((img) => img.id === id);
            if (removed) URL.revokeObjectURL(removed.preview);
            return prev.filter((img) => img.id !== id);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!form.parent_sku.trim()) {
            toast.error('Parent SKU is required');
            return;
        }

        setLoading(true);
        try {
            let uploadedImageUrl: string | null = null;

            // 1. Upload first image if exists, else check URL
            if (images.length > 0) {
                const compressed = await compressImage(images[0].file);
                const formData = new FormData();

                // Create a generic File from the Blob returned by compressImage
                const fileToUpload = new File([compressed], images[0].file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
                formData.append('file', fileToUpload);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    console.error('Failed to upload image');
                    toast.error('Failed to upload image, continuing anyway...');
                } else {
                    const uploadData = await uploadRes.json();
                    uploadedImageUrl = uploadData.url;
                }
            } else if (form.image_url.trim()) {
                uploadedImageUrl = form.image_url.trim();
            }

            // 2. Insert product and SKUs via API
            const productData = {
                sku: form.parent_sku.trim().toUpperCase(),
                title: form.product_name.trim() || form.parent_sku.trim().toUpperCase(), // fallback to SKU if no name
                description: form.description.trim() || null,
                category: form.category.trim() || null,
                main_image: uploadedImageUrl,
            };

            const skuCodes = childSkus
                .map((s) => s.child_sku.trim().toUpperCase())
                .filter(Boolean);

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productData, skuCodes })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Failed to add product to database');
            }

            toast.success('Product added successfully!');
            router.push('/dashboard/products');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to add product';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-white mb-6">Add New Product</h2>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Info */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-400" /> Product Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Product Name</Label>
                                <Input
                                    value={form.product_name}
                                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                                    placeholder="e.g. Men's Cotton T-Shirt"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Parent SKU *</Label>
                                <Input
                                    value={form.parent_sku}
                                    onChange={(e) => setForm({ ...form, parent_sku: e.target.value.toUpperCase() })}
                                    placeholder="e.g. MCT-001"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 font-mono"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Category</Label>
                                <Input
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    placeholder="e.g. T-Shirts"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">MRP (₹)</Label>
                                <Input
                                    type="number"
                                    value={form.mrp}
                                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                                    placeholder="e.g. 499"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs">Description</Label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Brief product description..."
                                rows={3}
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Child SKUs */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                <Package className="w-4 h-4 text-purple-400" /> Child SKUs
                            </CardTitle>
                            <Button type="button" onClick={addChildSku} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 text-xs h-8">
                                <Plus className="w-3 h-3 mr-1" /> Add SKU
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {childSkus.map((sku, idx) => (
                            <div key={sku.id} className="flex items-start gap-2">
                                <div className="flex-1 grid grid-cols-3 gap-2">
                                    <Input
                                        value={sku.child_sku}
                                        onChange={(e) => updateChildSku(sku.id, 'child_sku', e.target.value.toUpperCase())}
                                        placeholder="Child SKU"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9 text-xs font-mono"
                                    />
                                    <Input
                                        value={sku.size}
                                        onChange={(e) => updateChildSku(sku.id, 'size', e.target.value)}
                                        placeholder="Size"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9 text-xs"
                                    />
                                    <Input
                                        value={sku.color}
                                        onChange={(e) => updateChildSku(sku.id, 'color', e.target.value)}
                                        placeholder="Color"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9 text-xs"
                                    />
                                </div>
                                {childSkus.length > 1 && (
                                    <button type="button" onClick={() => removeChildSku(sku.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Images */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-amber-400" /> Product Images
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs">Image URL (Optional)</Label>
                            <Input
                                value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white/[0.02] px-2 text-slate-500">
                                    or upload files
                                </span>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {images.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(img.id)}
                                        className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 flex flex-col items-center justify-center gap-1.5 transition-all text-slate-500 hover:text-blue-400"
                            >
                                <Upload className="w-5 h-5" />
                                <span className="text-[10px]">Upload</span>
                            </button>
                        </div>

                        <p className="text-[10px] text-slate-600 mt-3">
                            Images are auto-compressed to WebP format for optimal performance.
                        </p>
                    </CardContent>
                </Card>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {loading ? 'Saving...' : 'Save Product'}
                </Button>
            </form>
        </div>
    );
}

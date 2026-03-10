'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getProductByIdAction, deleteProductAction } from '@/actions/productDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowLeft, Edit, Trash2, Layers, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: string;
    product_name: string;
    parent_sku: string;
    description: string | null;
    mrp: number | null;
    category: string | null;
    created_at: string;
    child_skus: { id: string; child_sku: string; size: string | null; color: string | null }[];
    product_images: { id: string; image_url: string; position: number }[];
}

function ProductDetailContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (!user || !productId) return;
        fetchProduct();
    }, [user, productId]);

    const fetchProduct = async () => {
        try {
            const data = await getProductByIdAction(productId!);
            if (!data) throw new Error('Product not found');
            setProduct(data);
        } catch {
            toast.error('Product not found');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this product? This cannot be undone.')) return;
        try {
            await deleteProductAction(productId!);
            toast.success('Product deleted');
            router.push('/dashboard/products');
        } catch {
            toast.error('Failed to delete');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>;
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">Product not found</p>
                <Link href="/dashboard/products" className="text-sm text-blue-400 hover:underline mt-2 inline-block">← Back to Products</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/products" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-white">{product.product_name}</h2>
                        <p className="text-xs text-slate-500 font-mono">{product.parent_sku}</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors" title="Delete product">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Images */}
                <Card className="bg-white/[0.02] border-white/5 lg:col-span-2">
                    <CardContent className="p-5">
                        {product.product_images.length > 0 ? (
                            <div className="space-y-3">
                                <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
                                    <img src={product.product_images[selectedImage]?.image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                                {product.product_images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto">
                                        {product.product_images.map((img, i) => (
                                            <button key={img.id} onClick={() => setSelectedImage(i)}
                                                className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${i === selectedImage ? 'border-blue-500' : 'border-white/10'}`}
                                            >
                                                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-square rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                <ImageIcon className="w-10 h-10 text-slate-700" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Details */}
                <div className="lg:col-span-3 space-y-5">
                    <Card className="bg-white/[0.02] border-white/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-white">Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { label: 'Category', value: product.category || '—' },
                                { label: 'MRP', value: product.mrp ? `₹${product.mrp}` : '—' },
                                { label: 'Added', value: new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                            ].map((item) => (
                                <div key={item.label} className="flex justify-between text-sm">
                                    <span className="text-slate-500">{item.label}</span>
                                    <span className="text-white">{item.value}</span>
                                </div>
                            ))}
                            {product.description && (
                                <div className="pt-2 border-t border-white/5">
                                    <p className="text-xs text-slate-500 mb-1">Description</p>
                                    <p className="text-sm text-slate-300">{product.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Child SKUs */}
                    <Card className="bg-white/[0.02] border-white/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                <Layers className="w-4 h-4 text-purple-400" /> Child SKUs ({product.child_skus.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.child_skus.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">No child SKUs</p>
                            ) : (
                                <div className="space-y-2">
                                    {product.child_skus.map((sku) => (
                                        <div key={sku.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                            <span className="text-sm text-white font-mono">{sku.child_sku}</span>
                                            <div className="flex items-center gap-2">
                                                {sku.size && <Badge variant="outline" className="text-[10px] border-blue-500/20 text-blue-400 bg-blue-500/5">{sku.size}</Badge>}
                                                {sku.color && <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-400 bg-green-500/5">{sku.color}</Badge>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function ProductDetailPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>}>
            <ProductDetailContent />
        </Suspense>
    );
}

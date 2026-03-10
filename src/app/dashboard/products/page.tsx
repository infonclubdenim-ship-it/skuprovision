'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { getProductsAction } from '@/actions/products';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Package, ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react';

interface Product {
    id: string;
    product_name: string;
    parent_sku: string;
    description: string | null;
    mrp: number | null;
    category: string | null;
    created_at: string;
    child_skus: { id: string; child_sku: string; size: string | null; color: string | null }[];
    product_images: { id: string; image_url: string }[];
}

const PAGE_SIZE = 12;

export default function ProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(searchQuery, 300);

    const fetchProducts = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, count } = await getProductsAction(page, PAGE_SIZE, debouncedSearch);
            setProducts(data || []);
            setTotalCount(count || 0);
        } catch (err) {
            console.error('Fetch products error:', err);
        } finally {
            setLoading(false);
        }
    }, [user, page, debouncedSearch]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setPage(0);
    }, [debouncedSearch]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Products</h2>
                    <p className="text-sm text-slate-500">{totalCount} products total</p>
                </div>
                <Link
                    href="/dashboard/products/add"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, Parent SKU, or Child SKU..."
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-11 rounded-xl"
                />
                {loading && searchQuery && (
                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 animate-spin" />
                )}
            </div>

            {/* Products grid */}
            {loading && products.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-16">
                    <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                        {searchQuery ? 'No products found' : 'No products yet'}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        {searchQuery ? 'Try a different search term.' : 'Start by adding your first product.'}
                    </p>
                    {!searchQuery && (
                        <Link
                            href="/dashboard/products/add"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-xl"
                        >
                            <Plus className="w-4 h-4" /> Add Product
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <Link href={`/dashboard/products/detail?id=${product.id}`}>
                                    <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer group h-full">
                                        <CardContent className="p-5">
                                            {/* Image preview */}
                                            <div className="w-full h-28 rounded-xl bg-white/[0.03] border border-white/5 mb-4 flex items-center justify-center overflow-hidden">
                                                {product.product_images?.[0]?.image_url ? (
                                                    <img
                                                        src={product.product_images[0].image_url}
                                                        alt={product.product_name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <Package className="w-8 h-8 text-slate-700" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <h3 className="text-sm font-medium text-white truncate mb-1 group-hover:text-blue-400 transition-colors">
                                                {product.product_name}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-mono mb-3">{product.parent_sku}</p>

                                            {/* Tags */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="outline" className="text-[10px] border-blue-500/20 text-blue-400 bg-blue-500/5 rounded-md">
                                                    {product.child_skus?.length || 0} SKUs
                                                </Badge>
                                                <Badge variant="outline" className="text-[10px] border-purple-500/20 text-purple-400 bg-purple-500/5 rounded-md">
                                                    {product.product_images?.length || 0} Images
                                                </Badge>
                                                {product.mrp && (
                                                    <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-400 bg-green-500/5 rounded-md">
                                                        ₹{product.mrp}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-slate-500 px-3">
                                Page {page + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

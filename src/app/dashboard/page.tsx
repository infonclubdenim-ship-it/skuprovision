'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardOverviewAction } from '@/actions/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Layers, Image, HardDrive, Plus, Search, ArrowUpRight, TrendingUp } from 'lucide-react';

interface DashboardStats {
    totalProducts: number;
    totalSkus: number;
    totalImages: number;
    storageSaved: string;
}

interface RecentProduct {
    id: string;
    product_name: string;
    parent_sku: string;
    created_at: string;
}

export default function DashboardOverviewPage() {
    const { user, profile } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0, totalSkus: 0, totalImages: 0, storageSaved: '0 MB',
    });
    const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const data = await getDashboardOverviewAction();
            setStats(data.stats);
            setRecentProducts(data.recentProducts);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
        { label: 'Total SKUs', value: stats.totalSkus, icon: Layers, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
        { label: 'Images', value: stats.totalImages, icon: Image, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10' },
        { label: 'Storage Saved', value: stats.storageSaved, icon: HardDrive, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white">
                    Welcome back, {profile?.full_name?.split(' ')[0] || 'there'} 👋
                </h2>
                <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening with your products.</p>
            </motion.div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                                        <card.icon className="w-5 h-5" style={{ color: 'rgb(96, 165, 250)' }} />
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                </div>
                                <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                                    {loading ? '...' : typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{card.label}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick actions + Recent products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Quick actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="bg-white/[0.02] border-white/5 h-full">
                        <CardContent className="p-5">
                            <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <Link href="/dashboard/products/add" className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors group">
                                    <Plus className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-blue-300">Add Product</span>
                                    <ArrowUpRight className="w-3 h-3 text-blue-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link href="/dashboard/products" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors group">
                                    <Search className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-300">Search Products</span>
                                    <ArrowUpRight className="w-3 h-3 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link href="/dashboard/import-export" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors group">
                                    <Package className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-300">Import from Excel</span>
                                    <ArrowUpRight className="w-3 h-3 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent products */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
                    <Card className="bg-white/[0.02] border-white/5 h-full">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-white">Recent Products</h3>
                                <Link href="/dashboard/products" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                    View All →
                                </Link>
                            </div>

                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : recentProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">No products yet</p>
                                    <Link href="/dashboard/products/add" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
                                        Add your first product →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/dashboard/products/detail?id=${product.id}`}
                                            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                                    <Package className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-white truncate">{product.product_name}</p>
                                                    <p className="text-xs text-slate-500 font-mono">{product.parent_sku}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-600 shrink-0 ml-2">
                                                {new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Plan usage bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="bg-white/[0.02] border-white/5">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-white">Plan Usage</h3>
                            <Link href="/dashboard/account" className="text-xs text-blue-400 hover:underline">Upgrade →</Link>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Products', used: stats.totalProducts, limit: profile?.plan === 'pro' ? 500 : profile?.plan === 'basic' ? 50 : 10, color: 'bg-blue-500' },
                                { label: 'SKU IDs', used: stats.totalSkus, limit: profile?.plan === 'pro' ? 2000 : profile?.plan === 'basic' ? 200 : 30, color: 'bg-purple-500' },
                            ].map((item) => {
                                const pct = item.limit > 0 ? Math.min((item.used / item.limit) * 100, 100) : 0;
                                return (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">{item.label}</span>
                                            <span className="text-slate-500">{item.used} / {item.limit}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

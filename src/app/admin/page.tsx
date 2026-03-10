'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getAdminStatsAction } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, ShoppingCart, Activity, ArrowUpRight, ArrowDownRight, UserPlus, FileText, Bell, Zap, Copy, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';

interface OverviewStats {
    totalUsers: number;
    activeUsers: number;
    totalProducts: number;
    totalSKUs: number;
    mrr: number; // Monthly Recurring Revenue estimation
    recentLogins: { id: string; name: string; email: string; time: string }[];
    planDistribution: { name: string; count: number }[];
    dailySignups: { date: string; signups: number }[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getAdminStatsAction();
            setStats(data as any);
        } catch (err) {
            toast.error('Failed to load admin stats');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Customers', value: stats?.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%', up: true },
        { title: 'Est. MRR', value: `₹${stats?.mrr.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+5%', up: true },
        { title: 'Total Products', value: stats?.totalProducts, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+24%', up: true },
        { title: 'Total SKUs', value: stats?.totalSKUs, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+35%', up: true },
    ];

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Super Admin Dashboard</h2>
                    <p className="text-slate-400 mt-1">Platform overview and key metrics.</p>
                </div>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div key={stat.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
                                        {loading ? (
                                            <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
                                        ) : (
                                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                        )}
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                                {!loading && (
                                    <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
                                        <span className={`flex items-center gap-0.5 ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                            {stat.trend}
                                        </span>
                                        <span className="text-slate-500">from last month</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts */}
                <Card className="lg:col-span-2 bg-white/[0.02] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-white">Signups (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            {loading ? (
                                <div className="w-full h-full bg-white/5 rounded animate-pulse" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.dailySignups}>
                                        <defs>
                                            <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                            itemStyle={{ color: '#ef4444' }}
                                        />
                                        <Area type="monotone" dataKey="signups" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSignups)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Distribution */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-white">Plan Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            {loading ? (
                                <div className="w-full h-full bg-white/5 rounded animate-pulse" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.planDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                        <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} className="capitalize" />
                                        <Tooltip
                                            cursor={{ fill: '#ffffff05' }}
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                        />
                                        <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-white">Recent Logins</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-12 w-full bg-white/5 rounded animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats?.recentLogins.map((user, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md">
                                        {user.time}
                                    </div>
                                </div>
                            ))}
                            {stats?.recentLogins.length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}

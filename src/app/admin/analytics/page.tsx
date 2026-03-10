'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActivityLogsAction } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Users, MousePointerClick, RefreshCcw, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityLog {
    id: string;
    user_id: string;
    action: string;
    details: any;
    ip_address: string;
    created_at: string;
    user_email?: string;
}

export default function AdminAnalyticsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock charts
    const searchTrends = [
        { name: 'Mon', searches: 120 }, { name: 'Tue', searches: 210 }, { name: 'Wed', searches: 150 },
        { name: 'Thu', searches: 280 }, { name: 'Fri', searches: 310 }, { name: 'Sat', searches: 400 }, { name: 'Sun', searches: 380 }
    ];

    const actionsDist = [
        { name: 'Login', count: 450 }, { name: 'Search', count: 850 },
        { name: 'Export', count: 120 }, { name: 'Upload', count: 230 }
    ];

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await getActivityLogsAction();
            setLogs(data);
        } catch {
            toast.error('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Platform Analytics</h2>
                    <p className="text-slate-400 mt-1">Detailed usage metrics and activity compliance logs.</p>
                </div>
                <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-500' : 'text-slate-400'}`} /> Refresh
                </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <Search className="w-4 h-4 text-emerald-400" /> API Searches (7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={searchTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                                    <Line type="monotone" dataKey="searches" stroke="#34d399" strokeWidth={3} dot={{ fill: '#0f172a', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#34d399' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <MousePointerClick className="w-4 h-4 text-purple-400" /> Action Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={actionsDist} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <RechartsTooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                                    <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" /> Recent Activity Logs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-white/5">
                            <div className="col-span-3">User</div>
                            <div className="col-span-2">Action</div>
                            <div className="col-span-3">Details</div>
                            <div className="col-span-2">IP / Source</div>
                            <div className="col-span-2 text-right">Time</div>
                        </div>

                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 w-full bg-white/5 rounded-lg my-1 animate-pulse" />)
                        ) : logs.length === 0 ? (
                            <div className="py-8 text-center text-sm text-slate-500">No activity logs found.</div>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center">
                                    <div className="col-span-3 truncate font-medium text-slate-300">
                                        {log.user_email}
                                        <div className="text-[10px] text-slate-600 font-mono mt-0.5">{log.user_id?.split('-')[0] || 'sys'}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${log.action.includes('login') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            log.action.includes('delete') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                log.action.includes('export') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </div>
                                    <div className="col-span-3 truncate text-slate-400 text-xs font-mono">
                                        {log.details ? JSON.stringify(log.details) : '—'}
                                    </div>
                                    <div className="col-span-2 text-slate-500 text-xs flex items-center gap-1.5 truncate">
                                        <ExternalLink className="w-3 h-3" /> {log.ip_address || '—'}
                                    </div>
                                    <div className="col-span-2 text-right text-xs text-slate-400">
                                        {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

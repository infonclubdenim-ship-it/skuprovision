'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActiveSessionsAction, terminateSessionAction } from '@/actions/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Globe, Clock, Laptop, ShieldAlert } from 'lucide-react';

interface DeviceSession {
    id: string;
    user_id: string;
    device_type: string;
    browser: string;
    os: string;
    ip_address: string | null;
    user_agent: string;
    is_active: boolean;
    last_active_at: string;
    user_email?: string;
}

export default function AdminDevicesPage() {
    const [sessions, setSessions] = useState<DeviceSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const data = await getActiveSessionsAction();
            setSessions(data);
        } catch (error) {
            console.error('Failed to load devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const terminateSession = async (id: string) => {
        if (!confirm('Force logout this device?')) return;
        try {
            await terminateSessionAction(id);
            setSessions(prev => prev.filter(s => s.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white tracking-tight">Active Devices</h2>
                <p className="text-slate-400 mt-1">Cross-reference device tracking and security audits.</p>
            </motion.div>

            <Card className="bg-white/[0.02] border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Device</th>
                                <th className="px-6 py-4">Location/IP</th>
                                <th className="px-6 py-4">Last Active</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-white/5">
                                        <td className="px-6 py-4"><div className="h-5 w-48 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-5 w-32 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-5 w-24 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-5 w-24 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-16 bg-white/5 rounded xl animate-pulse ml-auto" /></td>
                                    </tr>
                                ))
                            ) : sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No active device sessions recorded.
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((session) => (
                                    <tr key={session.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{session.user_email}</div>
                                            <div className="text-slate-500 text-[10px] font-mono mt-0.5">{session.user_id.split('-')[0]}...</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                    {session.device_type.toLowerCase().includes('mobile') ? (
                                                        <Smartphone className="w-4 h-4 text-cyan-400" />
                                                    ) : (
                                                        <Monitor className="w-4 h-4 text-blue-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-300">{session.os || 'Unknown OS'}</div>
                                                    <div className="text-xs text-slate-500">{session.browser || 'Unknown Browser'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Globe className="w-3.5 h-3.5" />
                                                <span className="font-mono text-xs">{session.ip_address || 'Hidden'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-slate-300">
                                                    {new Date(session.last_active_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(session.last_active_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => terminateSession(session.id)}
                                                className="text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <ShieldAlert className="w-3.5 h-3.5" /> Terminate
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

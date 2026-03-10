'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getDevicesAction, removeDeviceAction } from '@/actions/account';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PLAN_LIMITS, WHATSAPP_NUMBER } from '@/lib/constants';
import {
    CreditCard, Crown, Smartphone, Clock, Check, ArrowUpRight,
    MessageCircle, Shield, Loader2, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Device {
    id: string;
    device_name: string;
    browser: string;
    ip_address: string | null;
    last_active: string;
    is_current: boolean;
}

export default function AccountPage() {
    const { user, profile } = useAuth();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(true);

    const plan = (profile?.plan || 'free') as keyof typeof PLAN_LIMITS;
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    const trialEnd = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const isTrialActive = trialEnd && trialEnd > new Date();

    useEffect(() => {
        if (!user) return;
        fetchDevices();
    }, [user]);

    const fetchDevices = async () => {
        try {
            const data = await getDevicesAction();
            setDevices(data);
        } catch {
            console.error('Failed to fetch devices');
        } finally {
            setLoadingDevices(false);
        }
    };

    const removeDevice = async (id: string) => {
        try {
            await removeDeviceAction(id);
            setDevices((prev) => prev.filter((d) => d.id !== id));
            toast.success('Device removed');
        } catch {
            toast.error('Failed to remove device');
        }
    };

    const planColors: Record<string, string> = {
        free: 'from-slate-500 to-slate-400',
        basic: 'from-blue-500 to-cyan-500',
        pro: 'from-purple-500 to-pink-500',
        enterprise: 'from-amber-500 to-orange-500',
    };

    return (
        <div className="max-w-3xl mx-auto space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-white">Account</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your subscription and devices.</p>
            </motion.div>

            {/* Current Plan */}
            <Card className="bg-white/[0.02] border-white/5 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${planColors[plan] || planColors.free}`} />
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${planColors[plan] || planColors.free} flex items-center justify-center`}>
                                <Crown className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white capitalize">{plan} Plan</h3>
                                {isTrialActive && (
                                    <div className="flex items-center gap-1.5 text-xs text-amber-400">
                                        <Clock className="w-3 h-3" />
                                        Trial ends {trialEnd?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                )}
                                {!isTrialActive && plan === 'free' && (
                                    <p className="text-xs text-slate-500">Trial expired — upgrade to continue adding products</p>
                                )}
                            </div>
                        </div>
                        {plan !== 'enterprise' && (
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I want to upgrade my SKUProvision plan. My email: ${user?.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                            >
                                Upgrade <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>

                    {/* Plan limits */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { label: 'Products', value: limits.products === -1 ? 'Unlimited' : limits.products },
                            { label: 'SKU IDs', value: limits.skus === -1 ? 'Unlimited' : limits.skus },
                            { label: 'Images/Product', value: limits.images },
                            { label: 'Devices', value: limits.devices },
                            { label: 'Employees', value: limits.employees },
                        ].map((item) => (
                            <div key={item.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="text-sm font-semibold text-white">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</div>
                                <div className="text-[10px] text-slate-500">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Devices */}
            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-cyan-400" /> Active Devices ({devices.length}/{limits.devices})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingDevices ? (
                        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-blue-400 animate-spin" /></div>
                    ) : devices.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-6">No devices registered yet</p>
                    ) : (
                        <div className="space-y-2">
                            {devices.map((device) => (
                                <div key={device.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm text-white truncate">{device.device_name || device.browser}</p>
                                            <p className="text-xs text-slate-500">{new Date(device.last_active).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {device.is_current && (
                                            <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-400 bg-green-500/5">Current</Badge>
                                        )}
                                        {!device.is_current && (
                                            <button onClick={() => removeDevice(device.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageCircle className="w-5 h-5 text-green-400" />
                            <div>
                                <p className="text-sm font-medium text-white">Need help?</p>
                                <p className="text-xs text-slate-500">WhatsApp us for fastest support</p>
                            </div>
                        </div>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I need help with SKUProvision. My email: ${user?.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-xl transition-colors"
                        >
                            Chat Now
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

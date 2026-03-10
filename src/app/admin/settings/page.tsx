'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, Mail, Database, Globe, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        siteName: 'SKU Vision Pro',
        supportEmail: 'support@skuvisionpro.com',
        maintenanceMode: false,
        allowSignups: true,
        requireEmailVerification: true,
        dbMaxConnections: 100,
        storageQuotaGB: 500,
    });

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Platform settings saved successfully');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h2>
                    <p className="text-slate-400 mt-1">Global application settings, maintenance, and security.</p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-500 text-white gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* General Settings */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-400" /> General Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs">Site/Platform Name</Label>
                            <Input
                                value={config.siteName}
                                onChange={e => setConfig({ ...config, siteName: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Support Email</Label>
                            <Input
                                value={config.supportEmail}
                                onChange={e => setConfig({ ...config, supportEmail: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security / Access */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-emerald-400" /> Access & Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-200 font-medium">Allow New Signups</Label>
                                <p className="text-xs text-slate-500 mt-0.5">Toggle public registration via /signup</p>
                            </div>
                            <Switch
                                checked={config.allowSignups}
                                onCheckedChange={c => setConfig({ ...config, allowSignups: c })}
                                className="data-[state=checked]:bg-emerald-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-200 font-medium">Require Email Verification</Label>
                                <p className="text-xs text-slate-500 mt-0.5">Users must verify email before logging in</p>
                            </div>
                            <Switch
                                checked={config.requireEmailVerification}
                                onCheckedChange={c => setConfig({ ...config, requireEmailVerification: c })}
                                className="data-[state=checked]:bg-emerald-500"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                            <div>
                                <Label className="text-amber-400 font-medium">Maintenance Mode</Label>
                                <p className="text-xs text-amber-500/70 mt-0.5">Locks out all users except Super Admins</p>
                            </div>
                            <Switch
                                checked={config.maintenanceMode}
                                onCheckedChange={c => setConfig({ ...config, maintenanceMode: c })}
                                className="data-[state=checked]:bg-amber-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Database Limits (Visual only) */}
                <Card className="bg-white/[0.02] border-white/5 md:col-span-2">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <Database className="w-4 h-4 text-purple-400" /> Infrastructure Config (Supabase)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Max DB Connections</Label>
                                <Input
                                    type="number"
                                    value={config.dbMaxConnections}
                                    onChange={e => setConfig({ ...config, dbMaxConnections: parseInt(e.target.value) || 100 })}
                                    className="bg-white/5 border-white/10 text-white font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Total Storage Quota (GB)</Label>
                                <Input
                                    type="number"
                                    value={config.storageQuotaGB}
                                    onChange={e => setConfig({ ...config, storageQuotaGB: parseInt(e.target.value) || 500 })}
                                    className="bg-white/5 border-white/10 text-white font-mono"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/5">
                                    <Settings className="w-4 h-4 mr-2" /> Open Supabase Proj
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-white/5">
                            <p className="text-xs text-slate-500 font-mono">
                                Note: Real infrastructure changes should be made directly through the Supabase dashboard. These UI settings are mock placeholders for the demo.
                            </p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

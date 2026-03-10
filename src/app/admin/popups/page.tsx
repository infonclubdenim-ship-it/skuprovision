'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Megaphone, Save, Eye, Layout, Settings, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPopupsPage() {
    const [config, setConfig] = useState({
        enabled: true,
        title: '🎉 Limited Time Offer!',
        content: 'Upgrade to the Pro plan today and get 20% off your first 3 months. Use code PRO20 at checkout.',
        buttonText: 'Claim Offer',
        buttonLink: '/pricing',
        delaySeconds: 5,
        showOncePerUser: true,
        theme: 'gradient' as 'dark' | 'light' | 'gradient',
    });

    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Popup configuration saved');
        }, 800);
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Marketing Popups</h2>
                    <p className="text-slate-400 mt-1">Configure site-wide promotional popups and announcements.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                    <Save className="w-4 h-4" /> Save Config
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Editor Side */}
                <div className="space-y-6">
                    <Card className="bg-white/[0.02] border-white/5">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-emerald-400" /> General Settings
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">{config.enabled ? 'Active' : 'Disabled'}</span>
                                    <Switch
                                        checked={config.enabled}
                                        onCheckedChange={c => setConfig({ ...config, enabled: c })}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Popup Title</Label>
                                <Input
                                    value={config.title}
                                    onChange={e => setConfig({ ...config, title: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Main Content / Message</Label>
                                <Textarea
                                    value={config.content}
                                    onChange={e => setConfig({ ...config, content: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white resize-none h-24"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Call to Action (Button) Text</Label>
                                    <Input
                                        value={config.buttonText}
                                        onChange={e => setConfig({ ...config, buttonText: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Button Target URL</Label>
                                    <Input
                                        value={config.buttonLink}
                                        onChange={e => setConfig({ ...config, buttonLink: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white font-mono"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/5">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                <Layout className="w-4 h-4 text-amber-400" /> Display Rules & Aesthetics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Theme Style</Label>
                                    <select
                                        value={config.theme}
                                        onChange={e => setConfig({ ...config, theme: e.target.value as any })}
                                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    >
                                        <option value="dark">Sleek Dark</option>
                                        <option value="light">Clean Light</option>
                                        <option value="gradient">Brand Gradient (Red/Orange)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Delay Before Showing (Seconds)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={config.delaySeconds}
                                        onChange={e => setConfig({ ...config, delaySeconds: parseInt(e.target.value) || 0 })}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 mt-2 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                        <Label className="text-slate-300 font-medium">Show Only Once Per User Session</Label>
                                    </div>
                                    <Switch
                                        checked={config.showOncePerUser}
                                        onCheckedChange={c => setConfig({ ...config, showOncePerUser: c })}
                                        className="data-[state=checked]:bg-purple-500"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1.5">If disabled, the popup will show on every page load after the delay.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Live Preview Side */}
                <div>
                    <Card className="bg-black/50 border-white/5 h-[600px] border-dashed flex flex-col items-center justify-center p-8 relative overflow-hidden">

                        {/* Background dots for context */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />

                        <h3 className="absolute top-6 left-6 text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Live Preview
                        </h3>

                        {config.enabled ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={`relative z-10 w-full max-w-sm rounded-2xl shadow-2xl p-6 border ${config.theme === 'gradient' ? 'bg-gradient-to-br from-red-600 to-orange-600 border-white/20 text-white' :
                                        config.theme === 'light' ? 'bg-white border-slate-200 text-slate-900' :
                                            'bg-slate-900 border-white/10 text-white'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-xl ${config.theme === 'gradient' ? 'bg-white/20 text-white' :
                                            config.theme === 'light' ? 'bg-red-50 text-red-600' :
                                                'bg-slate-800 text-red-400'
                                        }`}>
                                        <Megaphone className="w-6 h-6" />
                                    </div>
                                    <button className={`p-1 mt-1 rounded-full opacity-70 hover:opacity-100 ${config.theme === 'light' ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-300 hover:bg-white/10'
                                        }`}>
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold mb-2">{config.title || 'Popup Title'}</h3>
                                <p className={`text-sm mb-6 leading-relaxed ${config.theme === 'gradient' ? 'text-white/90' :
                                        config.theme === 'light' ? 'text-slate-600' :
                                            'text-slate-300'
                                    }`}>
                                    {config.content || 'Your promotional message will appear here.'}
                                </p>

                                <button className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] ${config.theme === 'gradient' ? 'bg-white text-red-600 shadow-xl shadow-red-900/20' :
                                        config.theme === 'light' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' :
                                            'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                    }`}>
                                    {config.buttonText || 'Click Here'}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="z-10 text-slate-500 flex flex-col items-center">
                                <Eye className="w-12 h-12 mb-4 opacity-20" />
                                <p>Popup is currently disabled.</p>
                            </div>
                        )}

                    </Card>
                </div>

            </div>
        </div>
    );
}
